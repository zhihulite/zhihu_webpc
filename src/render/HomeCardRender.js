import {
	BaseRenderer
} from "./BaseRenderer";

export class HomeCardRender extends BaseRenderer {
	constructor(config = {}) {
		super(config);
	}

	/**
	 * 重写 renderBase 方法，提供自定义的 HTML 结构
	 * @param {Object} item - 数据项
	 * @param {number} index - 索引
	 * @param {Object} config - 配置对象
	 * @returns {string} 自定义 HTML 字符串
	 */
	renderBase(item, index, config = {}) {
		const header = this.formatTitle(item, config);
		const content = this.formatContent(item, config);
		const footer = this.formatAuthor(item);
		const id = this.getId(item);
		const dataType = this.getDataType(item);

		return `
    <div class="custom-render-item" 
         data-id="${id}" 
         data-type="${dataType}" 
         data-index="${index}"
         style="padding: 16px;">
      <div class="custom-header">
        <h3>${header}</h3>
        <span class="custom-author">${footer}</span>
      </div>
      <div class="custom-content">${content}</div>
    </div>
  `;
	}
}