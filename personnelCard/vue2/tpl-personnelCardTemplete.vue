<template>
  <div class="personnel-card-section" :style="{ height: d._bodyHeight - 20 + 'px' }">
    <div class="person-info-container" :style="{ display: 'table', height: getPersonInfoHeight() + 'px' }">
      <div class="card-info-wrapper" style="display: table-cell; vertical-align: middle;">
        <div class="person-info">
          <img v-if="hasAvatar" :src="d.Data.data.memberAvatar" class="person-avatar">
          <div class="person-detail" :style="{ top: pTop + 'px', left: hasAvatar ? '80px' : '14px' }">
            <div class="member-name" :style="{ width: member_width + 'px', color: d.preference.wordsColor || '#fff' }" :title="d.Data.data.memberName">{{ d.Data.data.memberName }}</div>
            <div class="member-post" :style="{ width: member_width + 'px', color: d.preference.wordsColor || '#fff' }" :title="d.Data.data.postName">{{ d.Data.data.postName }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="hasBulletin" style="width: 20px; margin-top: 18px; z-index: 10; position: absolute;">
      <i class="vportal vp-bulletin"></i>
    </div>
    <div v-if="hasBulletin" class="my-bulletin bulletin-container" :id="'bulletin-container-' + d.preference.entityId"
         :style="{ width: sectionWidth + 'px', height: '38px', marginLeft: '-15px', cursor: 'pointer', bottom: '-1px', borderBottomRightRadius: radio + 'px', borderBottomLeftRadius: radio + 'px' }">
      <div v-for="(item, index) in d.Data.data.bulList" :key="item.id" :style="{ top: (60 * index) + 'px' }" class="bulletin-item" :class="{ hidden: index !== 0 }" @click="openBulletin(item.id)">
        <div style="width: 100%"><span :style="{ width: sectionWidth - 60 + 'px' }" :title="item.title">{{ item.title }}</span></div>
        <div v-if="!item.hadRead" class="unread-mark" :id="'unread_' + item.id"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hasAvatar: !this.d.preference.showContents || this.d.preference.showContents.indexOf("avatar") >= 0,
      hasBulletin: (!this.d.preference.showContents || this.d.preference.showContents.indexOf("bulletin") >= 0) && this.d.Data.data.bulList,
      pTop: 0,
      bulletinTop: 0,
      sectionWidth: 0,
      member_width: 0,
      radio: 0,
    };
  },
  mounted() {
    this.calculateDimensions();
    this.initAutoPlay();
  },
  methods: {
    calculateDimensions() {
      this.pTop = (parseInt(this.d._bodyHeight) - 50 - (this.hasBulletin ? 36 : 0) - 14) / 2;
      this.bulletinTop = parseInt(this.d._bodyHeight) - 36;
      this.sectionWidth = Math.floor(this.d._sectionWidth);
      this.member_width = this.hasAvatar ? (parseInt(this.d._sectionWidth) - 110) : (parseInt(this.d._sectionWidth) - 50);
      this.radio = parseInt(vPortal.themeHotspots.section.sectionPanelBorderRadius) - 1;
    },
    getPersonInfoHeight() {
      return ((!this.d.preference.showContents || this.d.preference.showContents.indexOf('bulletin') >= 0) && this.d.Data.data.bulList) ? (this.d._bodyHeight - 56) : (this.d._bodyHeight - 20);
    },
    openBulletin(id) {
      if (id === '-1') {
        return;
      }
      const unreadMark = document.getElementById('unread_' + id);
      if (unreadMark) {
        unreadMark.style.display = 'none';
      }
      // Open bulletin details
      // ...
    },
    initAutoPlay() {
      const container = this.$el.querySelector('#bulletin-container-' + this.d.preference.entityId);
      if (!container) {
        return;
      }
      let isHovered = false;
      container.addEventListener('mouseenter', () => {
        isHovered = true;
      });
      container.addEventListener('mouseleave', () => {
        isHovered = false;
      });

      const moveUp = () => {
        if (!isHovered) {
          const firstItem = container.firstElementChild;
          container.appendChild(firstItem);
          const items = container.getElementsByClassName('bulletin-item');
          for (let i = 0; i < items.length; i++) {
            if (i === 0) {
              items[i].classList.remove("hidden");
            } else if (!items[i].classList.contains("hidden")) {
              items[i].classList.add("hidden");
            }
            items[i].style.top = i * 60 + 'px';
          }
        }
      };

      setInterval(moveUp, 5000);
    },
  },
};
</script>

<style scoped>
/* CSS styles remain the same */
</style>
