import React, { useState, useEffect, useRef } from 'react';

const PersonnelCard = ({ preference, data, bodyHeight, sectionWidth }) => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);

  const hasAvatar = !preference.showContents || preference.showContents.includes('avatar');
  const hasBulletin = (!preference.showContents || preference.showContents.includes('bulletin')) && data.bulList;
  const pTop = (parseInt(bodyHeight) - 50 - (hasBulletin ? 36 : 0) - 14) / 2;
  const bulletinTop = parseInt(bodyHeight) - 36;
  const member_width = hasAvatar ? (parseInt(sectionWidth) - 110) : (parseInt(sectionWidth) - 50);
  const mc = preference.wordsColor ? { color: preference.wordsColor } : { color: '#fff' };
  const radio = parseInt(preference.sectionPanelBorderRadius) > 0 ? parseInt(preference.sectionPanelBorderRadius) - 1 : 0;

  useEffect(() => {
    const moveUp = () => {
      if (!isHovered && containerRef.current) {
        const items = containerRef.current.getElementsByClassName(`bulletin-item-${preference.entityId}`);
        containerRef.current.appendChild(items[0]);
        for (let i = 0; i < items.length; i++) {
          items[i].style.top = i * 60 + 'px';
          if (i === 0) {
            items[i].classList.remove('hidden');
          } else if (!items[i].classList.contains('hidden')) {
            items[i].classList.add('hidden');
          }
        }
      }
    };

    const timer = setInterval(moveUp, 5000);
    return () => clearInterval(timer);
  }, [isHovered, preference.entityId]);

  const openBulletin = (id) => {
    if (id !== '-1') {
      document.getElementById(`unread_${id}`).style.display = 'none';
      window.openCtpWindow({ url: `${window._ctxPath}/bulData.do?method=bulView&bulId=${id}&from=list` });
    }
  };

  return (
    <div className="personnel-card-section" style={{ height: `${bodyHeight - 20}px` }}>
      <div className="person-info-container" style={{ display: 'table', height: `${hasBulletin ? (bodyHeight - 56) : (bodyHeight - 20)}px` }}>
        <div className="card-info-wrapper" style={{ display: 'table-cell', verticalAlign: 'middle' }}>
          <div className="person-info">
            {hasAvatar && <img src={data.memberAvatar} className="person-avatar" alt="Avatar" />}
            <div className="person-detail" style={{ top: `${pTop}px`, left: hasAvatar ? '80px' : '14px' }}>
              <div className="member-name" style={{ width: `${member_width}px`, ...mc }} title={data.memberName}>{data.memberName}</div>
              <div className="member-post" style={{ width: `${member_width}px`, ...mc }} title={data.postName}>{data.postName}</div>
            </div>
          </div>
        </div>
      </div>
      {hasBulletin && (
        <>
          <div style={{ width: '20px', marginTop: '18px', zIndex: 10, position: 'absolute' }}>
            <i className="vportal vp-bulletin"></i>
          </div>
          <div
            className="my-bulletin bulletin-container"
            id={`bulletin-container-${preference.entityId}`}
            style={{
              width: `${sectionWidth}px`,
              height: '38px',
              marginLeft: '-15px',
              cursor: 'pointer',
              bottom: '-1px',
              borderBottomRightRadius: `${radio}px`,
              borderBottomLeftRadius: `${radio}px`,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            ref={containerRef}
          >
            {data.bulList.map((item, index) => (
              <div
                key={item.id}
                style={{ top: `${index * 60}px` }}
                className={`bulletin-item-${preference.entityId} bulletin-item ${index === 0 ? '' : 'hidden'}`}
                onClick={() => openBulletin(item.id)}
              >
                <div style={{ width: '100%' }}>
                  <span style={{ width: `${sectionWidth - 60}px` }} title={item.title}>{item.title}</span>
                </div>
                {!item.hadRead && <div className="unread-mark" id={`unread_${item.id}`}></div>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PersonnelCard;
