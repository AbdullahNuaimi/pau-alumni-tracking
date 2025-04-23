export const getCategoryName = (cat) => {
    switch(cat) {
      case 'news': return 'أخبار';
      case 'events': return 'أحداث';
      case 'announcements': return 'إعلانات';
      case 'photos': return 'صور';
      default: return cat;
    }
  };

  export const getCategoryColor = (cat) => {
    const colors = {
      news: '#4a89dc',
      events: '#8cc152',
      announcements: '#f6bb42',
      photos: '#da4453'
    };
    return colors[cat] || '#a0d468';
  };