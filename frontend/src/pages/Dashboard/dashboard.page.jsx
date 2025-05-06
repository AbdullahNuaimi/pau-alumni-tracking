import { useState, useEffect, useMemo } from 'react';
import { saveAs } from 'file-saver';
import axios from 'axios';
import { useUser } from '../../contexts/UserContext';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { FaUsers, FaNewspaper, FaComment, FaChartLine, FaUniversity, FaBriefcase, FaCalendarAlt, FaFileAlt, FaDownload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

import NotificationSender from '../../components/NotificationSender/NotificationSender';

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
  const [colleges, setColleges] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const [selectedYear, setSelectedYear] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');

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
          setColleges(Object.keys(metricsResponse.data.data.usersByCollege || {}));
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


  const enhancedUsers = useMemo(() => {
    return users.map(user => ({
      ...user,
      graduationYear: user.universityId ? `20${user.universityId.substring(0, 2)}` : 'N/A'
    }));
  }, [users]);


  const filteredUsers = useMemo(() => {
    return enhancedUsers.filter(user => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = (
        user?.name?.toLowerCase().includes(query) ||
        user?.email?.toLowerCase().includes(query) ||
        user?.education?.[0]?.college?.toLowerCase().includes(query) ||
        user?.graduationYear?.toString().includes(searchQuery)
      );

      const matchesYear = selectedYear ? user.graduationYear === selectedYear : true;
      const matchesCollege = selectedCollege ?
        user.education?.[0]?.college === selectedCollege : true;

      return matchesSearch && matchesYear && matchesCollege;
    });
  }, [enhancedUsers, searchQuery, selectedYear, selectedCollege]);

  const availableYears = [...new Set(enhancedUsers.map(user => user.graduationYear))].sort();
  const availableColleges = [...new Set(
    enhancedUsers.flatMap(user => user.education?.map(edu => edu.college)).filter(Boolean)
  )].sort();

  const sortedUsers = useMemo(() => {
    let sortableUsers = [...filteredUsers];
    if (sortConfig.key) {
      sortableUsers.sort((a, b) => {

        const aValue = sortConfig.key.includes('.') ?
          sortConfig.key.split('.').reduce((o, i) => o?.[i], a) :
          a[sortConfig.key];

        const bValue = sortConfig.key.includes('.') ?
          sortConfig.key.split('.').reduce((o, i) => o?.[i], b) :
          b[sortConfig.key];

        if (sortConfig.key === 'career') {
          const aLength = a.career?.length || 0;
          const bLength = b.career?.length || 0;
          return sortConfig.direction === 'ascending' ? aLength - bLength : bLength - aLength;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [filteredUsers, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const exportToCSV = () => {
    const headers = ['الاسم', 'البريد الإلكتروني', 'الكلية', 'الحالة الوظيفية', 'سنة التخرج'];
    const data = sortedUsers.map(user => [
      `"${user.name || 'غير محدد'}"`,
      `"${user.email}"`,
      `"${user.education?.[0]?.college || 'غير محدد'}"`,
      `"${user.career?.length > 0 ? 'موظف' : 'غير موظف'}"`,
      `"${user.graduationYear}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString()
      .replace(/T/, '_')
      .replace(/\..+/, '')
      .replace(/:/g, '-');

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `users_${formattedDate}.csv`);
  };

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
  const sortedCollegeData = [...collegeData].sort((a, b) => b.value - a.value);

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
      <NotificationSender colleges={colleges} />

      <div className="charts-container">
        <ChartCard title="التوزيع الأكاديمي" icon={<FaUniversity />}>
          {sortedCollegeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={collegeData}
                layout="horizontal"
                margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  interval={0}
                  tickFormatter={(value) =>
                    value.length > 10 ?
                      value.substring(0, 10) + '...' :
                      value
                  }
                  width={100}
                />
                <YAxis
                  dataKey="value"
                  label={{
                    value: 'عدد الطلاب',
                    angle: -90,
                    position: 'insideLeft'
                  }}
                />
                <Tooltip
                  formatter={(value) => [value, 'عدد الطلاب']}
                  labelFormatter={(label) => `الكلية: ${label}`}
                />
                <Legend />
                <Bar
                  dataKey="value"
                  name="عدد الطلاب"
                  fill="#8884d8"
                  barSize={30}
                  radius={[4, 4, 0, 0]}
                >
                  {sortedCollegeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
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
                fill="#FFFFFF"
                dataKey="value"
                label
              >
                {employmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index + 4 % COLORS.length]} />
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
        <div className="users-section-header">
          <h2>قائمة المستخدمين ({sortedUsers.length})</h2>
          <button onClick={exportToCSV} className="btn-download">
            <FaDownload /> تصدير إلى CSV
          </button>
        </div>

        <div className="filters-container">
          <div className="filter-group">
            <label htmlFor="year-filter">سنة التخرج:</label>
            <select
              id="year-filter"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">الكل</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="college-filter">الكلية:</label>
            <select
              id="college-filter"
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
            >
              <option value="">الكل</option>
              {availableColleges.map(college => (
                <option key={college} value={college}>{college}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <input
              type="text"
              placeholder="ابحث عن مستخدم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="users-table-container">
          <div className="users-table-header">
            <div
              onClick={() => requestSort('name')}
              className={sortConfig.key === 'name' ? 'active-sort' : ''}
            >
              الاسم
              {sortConfig.key === 'name' && (
                sortConfig.direction === 'ascending' ? ' ↑' : ' ↓'
              )}
            </div>
            <div
              onClick={() => requestSort('email')}
              className={sortConfig.key === 'email' ? 'active-sort' : ''}
            >
              البريد الإلكتروني
              {sortConfig.key === 'email' && (
                sortConfig.direction === 'ascending' ? ' ↑' : ' ↓'
              )}
            </div>
            <div
              onClick={() => requestSort('education.0.college')}
              className={sortConfig.key === 'education.0.college' ? 'active-sort' : ''}
            >
              الكلية
              {sortConfig.key === 'education.0.college' && (
                sortConfig.direction === 'ascending' ? ' ↑' : ' ↓'
              )}
            </div>
            <div
              onClick={() => requestSort('career')}
              className={sortConfig.key === 'career' ? 'active-sort' : ''}
            >
              الحالة الوظيفية
              {sortConfig.key === 'career' && (
                sortConfig.direction === 'ascending' ? ' ↑' : ' ↓'
              )}
            </div>
            <div
              onClick={() => requestSort('graduationYear')}
              className={sortConfig.key === 'graduationYear' ? 'active-sort' : ''}
            >
              سنة التخرج
              {sortConfig.key === 'graduationYear' && (
                sortConfig.direction === 'ascending' ? ' ↑' : ' ↓'
              )}
            </div>
          </div>

          <div className="users-table-body">
            {sortedUsers.length > 0 ? (
              sortedUsers.map(user => (
                <div
                  key={user._id}
                  className="users-table-row"
                  onClick={() => navigate(`/ViewProfile/${user._id}`)}
                >
                  <div>{user.name || 'غير محدد'}</div>
                  <div>{user.email}</div>
                  <div>{user.education?.[0]?.college || 'غير محدد'}</div>
                  <div>{user.career?.length > 0 ? 'موظف' : 'غير موظف'}</div>
                  <div>{user.graduationYear}</div>
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