import "./community.css"

const Community = () => {

  return (
<div className="content">
        <h2>المنتدى</h2>

        <div className="new-post">
            <h3>أضف منشورًا جديدًا</h3>
            <textarea id="postText" placeholder="اكتب شيئًا..."></textarea>
            <input type="file" id="postImage" accept="image/*" />
            <button onClick="addPost()">نشر المنشور</button>
        </div>

        <div className="pending-posts">
            <h3 onClick="togglePending()">📌 المنشورات قيد المراجعة</h3>
            <div className="pending-posts-list" id="pendingPostsList"></div>
        </div>

        <div className="post">
            <div className="post-header">
                <i className="fa fa-user-circle"></i>
                <div className="user-info">
                    <span>أحمد محمود</span>
                    <small>قبل 3 ساعات</small>
                </div>
            </div>
            <p>افتتحت الجامعة مختبرًا حديثًا لتكنولوجيا المعلومات، مجهز بأحدث التقنيات.</p>
            <img src="Post1.jpg" alt="صورة المنشور" />
            <div className="actions">
                <button onClick="likePost(this)"><i className="fa fa-thumbs-up"></i> إعجاب</button>
                <button onClick="copyLink()"><i className="fa fa-share"></i> مشاركة</button>
            </div>
            <div className="comments">
                <input type="text" placeholder="اكتب تعليقك..." />
                <button className="comment-button" onClick="postComment(this)">نشر</button>
            </div>
        </div>
    </div>
  );
};

export default Community;