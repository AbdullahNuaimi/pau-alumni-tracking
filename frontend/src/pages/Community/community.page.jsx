import "./community.css"
import { useState } from "react";
import CreatePost from "../../components/CreatePost/createPost.component";
import PostCard from "../../components/PostCard/postCard";
import { useUser } from "../../contexts/UserContext";
import { examplePosts } from "../../assets/metPosts";
const Community = () => {
    const [posts, setPosts] = useState([...examplePosts]);
    const { user } = useUser();
    const [activeFilter, setActiveFilter] = useState('all');

    const visiblePosts = posts.filter(post =>
        (post.status === 'approved' || post.author === user.name || user.isAdmin) &&
        (activeFilter === 'all' || post.type === activeFilter)
    );

    const handlePostSubmit = (newPost) => {
        newPost.status = 'pending';
        setPosts([newPost, ...posts]);
        console.log(newPost);
    };

    const postFilters = [
        { id: 'all', label: 'الكل' },
        { id: 'general', label: 'عام' },
        { id: 'announcement', label: 'إعلانات' },
        { id: 'job', label: 'وظائف' },
        { id: 'success', label: 'قصص نجاح' }
    ];

    const handleApprove = (postId) => {
        setPosts(posts.map(post =>
            post.id === postId ? { ...post, status: 'approved' } : post
        ));
        // Add API call here to update backend
    };

    const handleReject = (postId) => {
        setPosts(posts.map(post =>
            post.id === postId ? { ...post, status: 'rejected' } : post
        ));
        // Add API call here to update backend
    };

    return (
        <div className="community-page">
            <h1>المجتمع الأكاديمي</h1>

            <CreatePost onPostSubmit={handlePostSubmit} />
            {/* Filter Tabs */}
            <div className="post-filters">
                {postFilters.map(filter => (
                    <button
                        key={filter.id}
                        className={`filter-tab ${activeFilter === filter.id ? 'active' : ''}`}
                        onClick={() => setActiveFilter(filter.id)}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
            <div className="posts-list">
                {visiblePosts.length > 0 ? (
                    visiblePosts.map(post => (
                        <PostCard key={post.id} post={post} onApprove={handleApprove} onReject={handleReject} />
                    ))
                ) : (
                    <p className="no-posts">لا توجد منشورات بعد. كن أول من ينشر!</p>
                )}
            </div>
        </div>
    );
};

export default Community;
{/* <div className="content">
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
              </div> */}