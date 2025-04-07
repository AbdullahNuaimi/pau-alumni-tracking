import './comment.css';


const Comment = ({post,udpatedPost,setUpdatedPost,commentText,setCommentText,showComments,setShowComments,showLike,setShowLike,user}) => {


    const handleLike = () => {
        const isLiked = post.likes.includes(user.id);
        if (isLiked) {
            post.likes = post.likes.filter(id => id !== user.id);
            setShowLike(false);
        } else {
            post.likes = [...post.likes, user.id];
            setShowLike(true);

        }

        // Update post (in real app, call API then update context)
        console.log('Liked post:', post.id);
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        const newComment = {
            id: Date.now(),
            author: user.name,
            authorId: user.id,
            authorImage: user.profilePic,
            content: commentText,
            date: new Date().toLocaleDateString('ar-EG')
        };

        setUpdatedPost({
            ...post,
            comments: [...post.comments, newComment]
        });
        post.comments = [...post.comments, newComment];
        // console.log('New comment:', newComment);
        console.log('comments:', post.comments);
        setCommentText('');
        // API call would go here
    };

    return (
        <div>
            <div className="post-actions">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleLike();
                    }}
                    className={`like-btn ${post.likes.includes(user.id) ? 'liked' : ''}`}
                >
                    {showLike ? '❤️' : '🤍'} إعجاب ({post.likes.length})
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowComments(!showComments);
                    }}
                    className="comment-btn"
                >
                    💬 تعليق ({udpatedPost.comments.length})
                </button>
            </div>
            <form onSubmit={handleCommentSubmit} className="comment-form">
                <img
                    src={user.profilePic || '/default-avatar.png'}
                    alt="صورة الملف الشخصي"
                    className="comment-avatar"
                />
                <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="اكتب تعليقاً..."
                    className="comment-input"
                />
                <button type="submit" className="comment-submit-btn">
                    نشر
                </button>
            </form>
            {showComments && (
                <div className="comments-section" onClick={e => e.stopPropagation()}>
                    <div className="comments-list">
                        {udpatedPost.comments.length > 0 ? (
                            udpatedPost.comments.map(comment => (
                                <div key={comment.id} className="comment">
                                    <div className="comment-header">
                                        <img
                                            src={comment.authorImage || '/default-avatar.png'}
                                            alt={comment.author}
                                            className="comment-avatar"
                                        />
                                        <div>
                                            <h4>{comment.author}</h4>
                                            <p className="comment-content">{comment.content}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-comments">لا توجد تعليقات بعد</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Comment;