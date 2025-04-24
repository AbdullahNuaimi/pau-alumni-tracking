import User from '../models/User.js';
import Article from '../models/Article.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

export const getMetrics = async (req, res) => {
  try {

    const [totalUsers, totalArticles, totalPosts, totalComments] = await Promise.all([
      User.countDocuments(),
      Article.countDocuments({ status: 'published' }),
      Post.countDocuments({ status: 'approved' }),
      Comment.countDocuments()
    ]);


    let usersByCollege = {};
    try {
      const collegeData = await User.aggregate([
        { $unwind: { path: '$education', preserveNullAndEmptyArrays: true } },
        { $group: { _id: '$education.college', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
      usersByCollege = collegeData.reduce((acc, curr) => {
        acc[curr._id || 'غير محدد'] = curr.count;
        return acc;
      }, {});
    } catch (error) {
      console.error('Error in college aggregation:', error);
    }


    let employmentStats = { employed: 0, unemployed: 0 };
    try {
      const employmentData = await User.aggregate([
        {
          $group: {
            _id: null,
            employed: { $sum: { $cond: [{ $gt: [{ $size: '$career' }, 0] }, 1, 0] } },
            unemployed: { $sum: { $cond: [{ $eq: [{ $size: '$career' }, 0] }, 1, 0] } }
          }
        }
      ]);
      employmentStats = employmentData[0] || employmentStats;
    } catch (error) {
      console.error('Error in employment aggregation:', error);
    }


    let growthData = [];
    try {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const monthData = await User.aggregate([
        {
          $match: { createdAt: { $gte: sixMonthsAgo } }
        },
        {
          $group: {
            _id: { $month: '$createdAt' },
            users: { $sum: 1 },
            posts: { $sum: { $size: { $ifNull: ['$posts', []] } } 
          }
        }},
        { $sort: { '_id': 1 } }
      ]);

      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      growthData = monthData.map(item => ({
        month: monthNames[item._id - 1],
        users: item.users,
        posts: item.posts
      }));
    } catch (error) {
      console.error('Error in growth data aggregation:', error);
    }

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalArticles,
        totalPosts,
        totalComments,
        usersByCollege,
        employmentStats,
        growthData
      }
    });

  } catch (error) {
    console.error('Error in getMetrics:', error);
    res.status(500).json({
      success: false,
      message: 'فشل تحميل البيانات الإحصائية'
    });
  }
};