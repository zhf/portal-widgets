import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class PersonnelCardComponent extends Component {
  @tracked isHovered = false;

  get bodyHeight() {
    return `height: ${this.args.bodyHeight - 20}px;`;
  }

  get personInfoContainerHeight() {
    const hasBulletin = (!this.args.preference.showContents || this.args.preference.showContents.includes('bulletin')) && this.args.Data.data.bulList;
    return `display: table; height: ${hasBulletin ? this.args.bodyHeight - 56 : this.args.bodyHeight - 20}px;`;
  }

  get hasAvatar() {
    return !this.args.preference.showContents || this.args.preference.showContents.includes('avatar');
  }

  get hasBulletin() {
    return (!this.args.preference.showContents || this.args.preference.showContents.includes('bulletin')) && this.args.Data.data.bulList;
  }

  get personDetailStyle() {
    const pTop = (parseInt(this.args.bodyHeight) - 50 - (this.hasBulletin ? 36 : 0) - 14) / 2;
    const left = this.hasAvatar ? '80' : '14';
    return `top: ${pTop}px; left: ${left}px;`;
  }

  get memberNameStyle() {
    const member_width = this.hasAvatar ? (parseInt(this.args.sectionWidth) - 110) : (parseInt(this.args.sectionWidth) - 50);
    const mc = typeof this.args.preference.wordsColor === 'undefined' ? 'color:#fff' : `color:${this.args.preference.wordsColor}`;
    return `width: ${member_width}px; ${mc};`;
  }

  get memberPostStyle() {
    const member_width = this.hasAvatar ? (parseInt(this.args.sectionWidth) - 110) : (parseInt(this.args.sectionWidth) - 50);
    const mc = typeof this.args.preference.wordsColor === 'undefined' ? 'color:#fff' : `color:${this.args.preference.wordsColor}`;
    return `width: ${member_width}px; ${mc};`;
  }

  get bulletinIconStyle() {
    return 'width: 20px; margin-top: 18px; z-index: 10; position: absolute;';
  }

  get bulletinContainerStyle() {
    const radio = parseInt(vPortal.themeHotspots.section.sectionPanelBorderRadius);
    const borderRadius = radio > 0 ? radio - 1 : radio;
    return `width: ${Math.floor(this.args.sectionWidth)}px; height: 38px; margin-left: -15px; cursor: pointer; bottom: -1px; border-bottom-right-radius: ${borderRadius}px; border-bottom-left-radius: ${borderRadius}px;`;
  }

  get bulletinTitleStyle() {
    return `width: ${Math.floor(this.args.sectionWidth) - 60}px;`;
  }

  bulletinItemStyle(index) {
    return `top: ${60 * index}px;`;
  }

  @action
  openBulletin(bulletinId) {
    if (bulletinId === '-1') {
      return;
    }
    // Mark as read
    document.getElementById(`unread_${bulletinId}`).style.display = 'none';

    openCtpWindow({ url: `${_ctxPath}/bulData.do?method=bulView&bulId=${bulletinId}&from=list` });
  }

  @action
  mouseEnter() {
    this.isHovered = true;
  }

  @action
  mouseLeave() {
    this.isHovered = false;
  }

  @action
  initAutoPlay() {
    const container = document.getElementById(`bulletin-container-${this.args.preference.entityId}`);
    if (!container) {
      return;
    }

    const moveUp = () => {
      if (!this.isHovered) {
        const firstItem = container.firstElementChild;
        container.appendChild(firstItem);

        const items = document.getElementsByClassName(`bulletin-item-${this.args.preference.entityId}`);
        for (let i = 0; i < items.length; i++) {
          if (i === 0) {
            items[i].classList.remove('hidden');
          } else if (!items[i].classList.contains('hidden')) {
            items[i].classList.add('hidden');
          }
          items[i].style.top = `${i * 60}px`;
        }
      }
    };

    clearInterval(this.autoPlayTimer);
    this.autoPlayTimer = setInterval(moveUp, 5000);
  }

  willDestroy() {
    clearInterval(this.autoPlayTimer);
  }
}
