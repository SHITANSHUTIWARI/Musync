/**
 * MUSYNC - Discover Controller
 */

const Profile = require('../models/Profile');
const User = require('../models/User');

/**
 * @desc    Get artists/producers with search, filters, and pagination
 * @route   GET /api/discover/artists
 * @access  Public
 */
const getArtists = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const { q, role, genre, location } = req.query;

    // Build aggregation pipeline
    const pipeline = [];

    // 1. Join with User collection
    pipeline.push({
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userData'
      }
    });

    // 2. Unwind user data (preserve projects without user? No, we need user for role)
    pipeline.push({
      $unwind: '$userData'
    });

    // 3. Match safe roles (artist, producer)
    // Only return users who are artists or producers
    // If role filter is provided, enforce it, otherwise allow both
    const rolesToMatch = role ? [role] : ['artist', 'producer'];
    
    const matchStage = {
      'userData.role': { $in: rolesToMatch }
    };

    // 4. Search text (displayName, bio, genres)
    if (q) {
      const searchRegex = { $regex: q, $options: 'i' };
      matchStage.$or = [
        { displayName: searchRegex },
        { bio: searchRegex },
        { genres: searchRegex }
      ];
    }

    // 5. Filter by genre
    if (genre) {
      matchStage.genres = { $regex: genre, $options: 'i' };
    }

    // 6. Filter by location
    if (location) {
      matchStage.location = { $regex: location, $options: 'i' };
    }

    pipeline.push({ $match: matchStage });

    // 7. Pagination Facet
    pipeline.push({
      $facet: {
        metadata: [{ $count: 'total' }],
        data: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: 1,
              displayName: 1,
              bio: 1,
              genres: 1,
              location: 1,
              avatar: 1,
              socialLinks: 1,
              userId: '$userData._id',
              role: '$userData.role'
              // Explicitly excluding private fields by not including them
            }
          }
        ]
      }
    });

    const result = await Profile.aggregate(pipeline);
    
    const metadata = result[0].metadata[0];
    const totalResults = metadata ? metadata.total : 0;
    const totalPages = Math.ceil(totalResults / limit);
    const results = result[0].data;

    res.status(200).json({
      success: true,
      page,
      limit,
      totalResults,
      totalPages,
      results
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getArtists
};
