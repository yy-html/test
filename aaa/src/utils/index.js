export const throttle = (method, interval, context) => {
  clearTimeout(method.tId)
  method.tId = setTimeout(function () {
    method.call(context)
  }, interval)
}
// scrollTop animation
export const scrollTop = (el, from = 0, to, duration = 500, endCallback) => {
  if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = (
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function (callback) {
              return window.setTimeout(callback, 1000/60);
          }
      );
  }
  const difference = Math.abs(from - to);
  const step = Math.ceil(difference / duration * 50);

  function scroll(start, end, step) {
      if (start === end) {
          endCallback && endCallback();
          return;
      }

      let d = (start + step > end) ? end : start + step;
      if (start > end) {
          d = (start - step < end) ? end : start - step;
      }

      if (el === window) {
          window.scrollTo(d, d);
      } else {
          el.scrollTop = d;
      }
      window.requestAnimationFrame(() => scroll(d, end, step));
  }
  scroll(from, to, step);
}

//canvas 转换图片
export const canvasToImage = (canvas, fileName) => {
  if (!fileName) {
    fileName = new Date().getTime()
  }
  var eleLink = document.createElement('a');
  eleLink.download = fileName;
  eleLink.style.display = 'none';
  // 如果是PNG图片，则context.toDataURL('image/png');
  eleLink.href= canvas.toDataURL('image/jpeg', 0.9);
  // 触发点击
  document.body.appendChild(eleLink);
  eleLink.click();
  // 移除
  document.body.removeChild(eleLink);
}

export const closeCurrentPage = () => {
    if (navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Chrome") !=-1) {
        window.location.href="about:blank";
        window.close();
    } else {
        window.opener = null;
        window.open("", "_self");
        window.close();
    }
  }
export default {
  throttle,
  scrollTop,
  canvasToImage,
  closeCurrentPage
}