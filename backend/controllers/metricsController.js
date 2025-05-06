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
      const now = new Date();
      const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const sixMonthsAgo = new Date(startOfCurrentMonth);
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5); 


      const userGrowth = await User.aggregate([
        {
          $match: {
            createdAt: {
              $gte: sixMonthsAgo,
              $lte: now
            }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            users: { $sum: 1 }
          }
        }
      ]);

      const postGrowth = await Post.aggregate([
        {
          $match: {
            createdAt: {
              $gte: sixMonthsAgo,
              $lte: now
            }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            posts: { $sum: 1 }
          }
        }
      ]);

      const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

      const resultMap = new Map();
      const currentDate = new Date(sixMonthsAgo);

      while (currentDate <= now) {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const key = `${year}-${month}`;
        resultMap.set(key, {
          month: monthNames[month - 1],
          year: year,
          users: 0,
          posts: 0
        });
        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      userGrowth.forEach(item => {
        const key = `${item._id.year}-${item._id.month}`;
        if (resultMap.has(key)) {
          resultMap.get(key).users = item.users;
        }
      });

      postGrowth.forEach(item => {
        const key = `${item._id.year}-${item._id.month}`;
        if (resultMap.has(key)) {
          resultMap.get(key).posts = item.posts;
        }
      });

      growthData = Array.from(resultMap.values())
        .sort((a, b) => a.year === b.year ? a.month - b.month : a.year - b.year);

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