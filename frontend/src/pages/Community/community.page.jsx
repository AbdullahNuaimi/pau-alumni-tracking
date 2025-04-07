import "./community.css"
import { useState, useEffect } from "react";
import CreatePost from "../../components/CreatePost/createPost.component";
import PostCard from "../../components/PostCard/postCard";
import { useUser } from "../../contexts/UserContext";
import { examplePosts } from "../../assets/metPosts";
import { useLocation } from "react-router-dom";

const Community = () => {
    const [posts, setPosts] = useState([...examplePosts]);
    const { user } = useUser();
    const [activeFilter, setActiveFilter] = useState('all');
    const location = useLocation();
    useEffect(() => {
        if (location.pathname === '/community/jobs') {
            setActiveFilter('job');
        } else if (location.pathname === '/community/success-stories') {
            setActiveFilter('success');
        } else {
            setActiveFilter('all');
        }
    }, [location.pathname]);
    const visiblePosts = posts.filter(post => {
        const statusMatch = 
          activeFilter === 'pending' ? 
          post.status === 'pending' : 
          (post.status === 'approved' || post.author === user.name || user.isAdmin);
        
        const typeMatch = 
          ['all', 'pending'].includes(activeFilter) || 
          post.type === activeFilter;
        
        return statusMatch && typeMatch;
      });

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
        { id: 'success', label: 'قصص نجاح' },
        ...(user.isAdmin ? [{ id: 'pending', label: 'قيد المراجعة' }] : [])
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