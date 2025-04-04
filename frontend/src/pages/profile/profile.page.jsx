import './profile.css';
import pfp from '../../assets/default pfp.png';

const Profile = () => {
    return (
        <div className='profile-page'>
            <div className="content">
                <h2>إعدادات المستخدم</h2>
                <div className="section">
                    <h3>الصورة الشخصية</h3>
                    <div className="profile-pic-container">
                        <img src={pfp} id="profilePic" className="profile-pic" alt="الصورة الشخصية" />
                        <div>
                            <input type="file" id="profileInput" className="file-input" accept="image/*" />
                            <label for="profileInput" className="upload-btn">تغيير الصورة</label>
                        </div>
                    </div>
                </div>


                <div className="section">
                    <h3>المعلومات الشخصية</h3>
                    <div className="form-group">
                        <label for="name">الاسم الكامل</label>
                        <input type="text" id="name" value="محمد أحمد" />
                    </div>
                    <div className="form-group">
                        <label for="email">البريد الإلكتروني</label>
                        <input type="email" id="email" value="mohammad@example.com" />
                    </div>
                    <button className="save-btn">حفظ التغييرات</button>
                </div>


                <div className="section">
                    <h3 className="toggle-password" onclick="togglePasswordSection()">تغيير كلمة المرور <i className="fa fa-chevron-down"></i></h3>
                    <div className="password-section">
                        <div className="form-group">
                            <label for="new-password">كلمة المرور الجديدة</label>
                            <input type="password" id="new-password" />
                        </div>
                        <div className="form-group">
                            <label for="confirm-password">تأكيد كلمة المرور</label>
                            <input type="password" id="confirm-password" />
                        </div>
                        <button className="save-btn">تحديث كلمة المرور</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;