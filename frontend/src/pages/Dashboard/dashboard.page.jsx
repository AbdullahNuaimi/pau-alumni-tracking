import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../contexts/UserContext';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { FaUsers, FaNewspaper, FaComment, FaChartLine, FaUniversity, FaBriefcase, FaCalendarAlt,FaFileAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

const Dashboard = () => {
  const { user } = useUser();
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalArticles: 0,
    totalPosts: 0,
    totalComments: 0,
    usersByCollege: {},
    employmentStats: { employed: 0, unemployed: 0 },
    growthData: []
  });
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsResponse, usersResponse] = await Promise.all([
          axios.get('/api/v1/metrics', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get('/api/v1/users/admin/getUsers', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
        ]);

        if (metricsResponse.data.success) {
          setMetrics({
            totalUsers: metricsResponse.data.data.totalUsers || 0,
            totalArticles: metricsResponse.data.data.totalArticles || 0,
            totalPosts: metricsResponse.data.data.totalPosts || 0,
            totalComments: metricsResponse.data.data.totalComments || 0,
            usersByCollege: metricsResponse.data.data.usersByCollege || {},
            employmentStats: metricsResponse.data.data.employmentStats || { employed: 0, unemployed: 0 },
            growthData: metricsResponse.data.data.growthData || []
          });
        }

        setUsers(Array.isArray(usersResponse.data?.data) ? usersResponse.data.data : []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('فشل تحميل بيانات لوحة التحكم');
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user]);

  const filteredUsers = users.filter(user => 
    user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (!user || user.role !== 'admin') {
    return <div className="unauthorized">غير مسموح بالوصول</div>;
  }

  if (loading) {
    return <div className="loading">جاري تحميل البيانات...</div>;
  }

  const collegeData = Object.entries(metrics.usersByCollege).map(([name, value]) => ({ name, value }));
  const employmentData = [
    { name: 'موظفين', value: metrics.employmentStats.employed },
    { name: 'غير موظفين', value: metrics.employmentStats.unemployed }
  ];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title"><FaChartLine /> لوحة التحكم</h1>

      <div className="stats-grid">
        <StatCard 
          icon={<FaUsers />} 
          title="إجمالي المستخدمين" 
          value={metrics.totalUsers} 
          color="#0088FE"
        />
        <StatCard 
          icon={<FaNewspaper />} 
          title="المقالات المنشورة" 
          value={metrics.totalArticles} 
          color="#00C49F"
        />
        <StatCard 
          icon={<FaFileAlt />} 
          title="المنشورات" 
          value={metrics.totalPosts} 
          color="#ac0075"
        />
        <StatCard 
          icon={<FaComment />} 
          title="التعليقات" 
          value={metrics.totalComments} 
          color="#FFBB28"
        />
        <StatCard 
          icon={<FaBriefcase />} 
          title="الموظفين" 
          value={metrics.employmentStats.employed} 
          color="#FF8042"
        />
      </div>


      <div className="charts-container">
        <ChartCard title="التوزيع الأكاديمي" icon={<FaUniversity />}>
          {collegeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={collegeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {collegeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'عدد المستخدمين']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="no-data">لا توجد بيانات متاحة</p>
          )}
        </ChartCard>

        <ChartCard title="الحالة الوظيفية" icon={<FaBriefcase />}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={employmentData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {employmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index + 2 % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'عدد المستخدمين']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="النمو الشهري" icon={<FaCalendarAlt />}>
          {metrics.growthData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics.growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#8884d8" 
                  name="مستخدمين جدد"
                />
                <Line 
                  type="monotone" 
                  dataKey="posts" 
                  stroke="#82ca9d" 
                  name="منشورات جديدة"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="no-data">لا توجد بيانات متاحة</p>
          )}
        </ChartCard>
      </div>


      <div className="users-section">
        <h2>قائمة المستخدمين ({filteredUsers.length})</h2>
        <input
          type="text"
          placeholder="ابحث عن مستخدم..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        
        <div className="users-table-container">
          <div className="users-table-header">
            <div>الاسم</div>
            <div>البريد الإلكتروني</div>
            <div>الكلية</div>
            <div>الحالة الوظيفية</div>
          </div>
          <div className="users-table-body">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <div key={user._id} className="users-table-row" onClick={()=>{navigate(`/ViewProfile/${user._id}`)}}>
                  <div>{user.name || 'غير محدد'}</div>
                  <div>{user.email}</div>
                  <div>{user.education?.[0]?.college || 'غير محدد'}</div>
                  <div>{user.career?.length > 0 ? 'موظف' : 'غير موظف'}</div>
                </div>
              ))
            ) : (
              <div className="no-users">لا يوجد مستخدمين مطابقين</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


const StatCard = ({ icon, title, value, color }) => (
  <div className="stat-card" style={{ borderTop: `4px solid ${color}` }}>
    <div className="stat-icon" style={{ color }}>{icon}</div>
    <h3>{title}</h3>
    <p>{value.toLocaleString('ar-EG')}</p>
  </div>
);


const ChartCard = ({ title, icon, children }) => (
  <div className="chart-card">
    <div className="chart-title">
      {icon}
      <h3>{title}</h3>
    </div>
    {children}
  </div>
);

export default Dashboard;