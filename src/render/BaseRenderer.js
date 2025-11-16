// src/utils/BaseRenderer.js

/**
 * 基础渲染器类
 * 封装通用的数据处理逻辑
 */
export class BaseRenderer {
  constructor(config = {}) {
    // 默认配置
    this.defaultConfig = {
      truncateTitleLength: 30,
      truncateContentLength: 100,
      ...config
    };
  }

  /**
   * 格式化标题
   * @param {Object} item - 数据项
   * @param {Object} config - 配置对象
   * @returns {string} 格式化后的标题
   */
  formatTitle(item, config = {}) {
    const { truncateLength = this.defaultConfig.truncateTitleLength } = config;
    let title = '';

    if (item.target?.content?.title) {
      title = item.target.content.title.trim();
    } else if (item.target?.question?.title) {
      title = item.target.question.title.trim();
    } else if (item.target?.excerpt_title) {
      title = item.target.excerpt_title.trim();
    }

    // 如果标题太长，截取
    if (title && truncateLength && title.length > truncateLength) {
      return title.substring(0, truncateLength) + '...';
    }
    return title || '';
  }

  /**
   * 格式化内容摘要
   * @param {Object} item - 数据项
   * @param {Object} config - 配置对象
   * @returns {string} 格式化后的内容摘要
   */
  formatContent(item, config = {}) {
    const { maxLength = this.defaultConfig.truncateContentLength } = config;
    let content = '';

    if (item.target?.excerpt) {
      content = item.target.excerpt.trim();
    } else if (item.target?.excerpt_new) {
      content = item.target.excerpt_new.trim();
    } else if (item.target?.excerpt_title) {
      content = item.target.excerpt_title.trim();
    }

    // 如果内容太长，截取
    if (content && maxLength && content.length > maxLength) {
      return content.substring(0, maxLength) + '...';
    }
    return content || '';
  }

  /**
   * 格式化作者信息
   * @param {Object} item - 数据项
   * @returns {string} 格式化后的作者信息
   */
  formatAuthor(item) {
    const author = item.target?.author?.name || '未知作者';
    const votes = item.target?.voteup_count || 0;
    const comment_count = item.target?.comment_count || 0;

    return `${author} · ${votes} 赞同 · ${comment_count} 评论`;
  }

  /**
   * 生成 ID (如果需要)
   * @param {Object} item - 数据项
   * @returns {string|number} ID
   */
  getId(item) {
    return item.target?.id || null;
  }

  /**
   * 生成数据类型 (如果需要)
   * @param {Object} item - 数据项
   * @returns {string} 数据类型
   */
  getDataType(item) {
    return item.target?.type || 'unknown';
  }

  /**
   * 生成作者链接 (如果需要)
   * @param {Object} item - 数据项
   * @returns {string} 作者链接
   */
  getAuthorUrl(item) {
    const authorUrl = item.target?.author?.url || '#';
    return authorUrl.replace("api.", "") || '#';
  }

  /**
   * 生成作者链接 Base64 编码 (如果需要)
   * @param {Object} item - 数据项
   * @returns {string} Base64 编码的作者链接
   */
  getAuthorUrlBase64(item) {
    const authorUrl = item.target?.author?.url || '#';
    try {
      return btoa(authorUrl.replace("api.", ""));
    } catch (e) {
      return '#';
    }
  }

  /**
   * 生成基础的 HTML 结构
   * @param {Object} item - 数据项
   * @param {number} index - 索引
   * @param {Object} config - 配置对象
   * @returns {string} 基础 HTML 字符串
   */
  renderBase(item, index, config = {}) {
    const header = this.formatTitle(item, config);
    const content = this.formatContent(item, config);
    const footer = this.formatAuthor(item);
    const id = this.getId(item);
    const dataType = this.getDataType(item);
    const authorUrl = this.getAuthorUrl(item);
    const authorUrlBase64 = this.getAuthorUrlBase64(item);

    return `
      <div class="base-render-item" data-id="${id}" data-type="${dataType}" data-index="${index}">
        <h3 class="base-header">${header}</h3>
        <p class="base-content">${content}</p>
        <div class="base-footer">${footer}</div>
      </div>
    `;
  }

  /**
   * 创建一个基础的 renderFunction
   * @param {Object} config - 配置对象
   * @returns {Function} renderFunction (item, index) => string
   */
  createRenderFunction(config = {}) {
    // 返回一个函数，接收 item 和 index 并返回 HTML
    return (item, index) => {
      return this.renderBase(item, index, config); // 调用基础方法
    };
  }

  /**
   * 创建一个自定义的 renderFunction
   * @param {Function} customRenderer - 自定义渲染函数 (item, index, utils) => string
   * @param {Object} config - 配置对象
   * @returns {Function} 最终的 renderFunction
   */
  createCustomRenderFunction(customRenderer, config = {}) {
    // 返回一个函数，接收 item 和 index 并返回 HTML
    return (item, index) => {
      // 传递 this (utils) 给自定义函数，以便其可以调用基础方法
      return customRenderer(item, index, this, config);
    };
  }
}