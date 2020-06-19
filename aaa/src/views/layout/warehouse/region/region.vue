<template>
  <div v-if="showPage" id="page" class="page" :class="bindPage" ref="page">
    <div class="leftArea" v-if="!bindPage">
      <Card class="card">
        <p slot="title">绘制布局图</p>
        <p>{{warehouseName}}</p>
      </Card>
      <Card class="card">
        <p slot="title">画布尺寸</p>长
        <Input
          v-model="width"
          :disabled="isDetail"
          size="small"
          style="width:50px;margin-bottom:5px;"
          placeholder
        />cm
        <br />宽
        <Input v-model="height" :disabled="isDetail" size="small" style="width:50px" placeholder />cm
        <p style="height:10px;"></p>缩放比例
        <Input
          oType="text"
          size="small"
          style="width:50px;"
          disabled
          placeholder="比例尺"
          v-model="scale"
        />
        <br />
      </Card>
      <Card class="card" id="areaDrag" v-if="!isDetail">
        <p slot="title">区域</p>
        <Button
          draggable
          style="cursor:move;margin-right:5px;margin-bottom:5px;"
          v-for="(item,index) in areaList"
          :key="index"
          size="small"
          type="primary"
          @dragstart.native="(e)=>{dragArea(e,item)}"
        >{{item.districtName}}</Button>
        <Button @click="addWall" style="margin-bottom:5px;width:100%;">点击增加墙</Button>
      </Card>
      <Card class="card" id="deviceDrag" v-if="!isDetail">
        <p slot="title">设备</p>
        <Input
          suffix="ios-search"
          placeholder="搜索"
          v-model="deviceSearchStr"
          style="width: auto;margin-bottom:10px;"
        />
        <Collapse v-model="collapseIndex">
          <Panel v-for="(val,key) in deviceListObj" :key="key" :name="key">
            {{key}}
            <div class="blockWrap" slot="content">
              <div v-for="(item) in val" :key="item.id" class="deviceBlock">
                <Card class="iconCard">
                  <img
                    style="cursor:move;"
                    draggable
                    @dragstart="(e)=>{dragDevice(e,item)}"
                    class="iconImg"
                    :src="item.iconUrl"
                    alt
                  />
                  <p class="iconText">{{item.equipmentName}}</p>
                </Card>
              </div>
            </div>
          </Panel>
        </Collapse>
      </Card>
      <Card class="card" v-if="isDev&&!isDetail">
        <p slot="title">开发环境</p>
        <Button @click="addRect()" style="margin-bottom:5px;width:100%;">增加区域</Button>
        <Button @click="addDevice()" style="margin-bottom:5px;width:100%;">增加设备</Button>
        <Button @click="checkOver" style="margin-bottom:5px;width:100%;">手动检测碰撞</Button>
        <Button @click="loadData()" style="margin-bottom:5px;width:100%;">加载数据</Button>
        <Button @click="loadByNet()" style="margin-bottom:5px;width:100%;">远程加载</Button>
        <Button @click="lockBasis" style="margin-bottom:5px;width:100%;">锁定</Button>
        <Button @click="exportPng(true)" style="margin-bottom:5px;width:100%;">生成并上传图片</Button>
      </Card>
    </div>
    <Card class="btns">
      <Button type="text" v-if="!!bindPage">匹配货架：{{warehouseName}}</Button>
      <Button @click="exportPng()">预览</Button>
      <Button @click="exportFile" v-if="!bindPage">导出</Button>
      <Button @click="scaleFn(true)">放大</Button>
      <Button @click="scaleFn(false)">缩小</Button>
      <Button type="primary" v-if="!!bindPage" @click="toChenlie">调整选中陈列库位</Button>
      <Button v-if="!!bindPage" @click="cancelSP">关闭页面</Button>

      <!-- <Button @click="lockBasis(true)">锁定底图</Button>
      <Button @click="lockBasis(false)">解锁底图</Button>-->
      <Button
        id="delBtn"
        :disabled="isDetail"
        @click="deleteObj"
        v-if="!bindPage&&!isDetail"
      >删除选中元素(shift+删除)</Button>
      <Button :disabled="isDetail" @click="undo" v-if="!bindPage&&!isDetail">撤销(ctrl+z)</Button>
      <Button
        :disabled="isDetail"
        type="primary"
        @click="saveData"
        v-if="hasPermission('savePaint')&&!bindPage&&!isDetail"
      >提交数据</Button>

      <!-- <Button @click="redo">重做(ctrl+y)</Button> -->
    </Card>
    <div
      :style="{height:(Number(height*scale)+Number(gap*2))+'px'}"
      class="mainWrap"
      :class="[{mt45:isDetail}]"
    >
      <div class="canvasWrap" ref="canvasWrap">
        <canvas id="canvasWrap"></canvas>
      </div>
      <div
        class="canvas"
        ref="canvas"
        :style="{position:'absolute',left:this.gap + 'px',top:this.gap+'px'}"
      >
        <canvas id="canvas"></canvas>
      </div>
      <div
        v-show="showTopAbs"
        @drop="dropObj"
        @dragover="(e)=>{e.preventDefault()}"
        class="topAbs"
        ref="topAbs"
      >
        <canvas id="canvasTop"></canvas>
      </div>
    </div>

    <div v-if="!bindPage&&!isDetail" ref="dragCard1" class="draggable dragCard">
      <div class="moveArea" @mousedown.stop="(e)=>mouseDown(e,'dragCard1')">拖拽移动</div>
      <Card v-if="!bindPage" id="setStyle">
        <p slot="title">样式</p>
        <span class="propName">名称</span>
        <Input
          type="textarea"
          maxlength="20"
          :autosize="true"
          :rows="1"
          class="propInput"
          v-model="now.nowName"
          size="small"
          placeholder
        />
        <br />
        <span class="propName">背景颜色</span>
        <ColorPicker
          style="min-width:60px;margin-bottom:5px;"
          v-model="now.nowColor"
          recommend
          size="small"
        />
        <br />
        <!-- <span class="propName">字体颜色</span>
        <ColorPicker
          style="min-width:60px;margin-bottom:5px;"
          v-model="now.nowTextColor"
          recommend
          size="small"
        />
        <br />-->
        <span v-if="showWidth" class="propName">长(cm)</span>
        <Input
          v-if="showWidth"
          class="propInput"
          v-model="now.nowWidth"
          size="small"
          style="width:87px;"
          placeholder
        />
        <br v-if="showWidth" />
        <span v-if="showHeight" class="propName">宽(cm)</span>
        <Input
          v-if="showHeight"
          class="propInput"
          v-model="now.nowHeight"
          size="small"
          style="width:87px;"
          placeholder
        />
        <br v-if="showHeight" />
        <hr class="divideHr" />
        <span class="propName">角度</span>
        <Input class="propInput" v-model="now.nowAngle" size="small" placeholder />
        <Button
          size="small"
          @click="now.nowAngle = 0"
          style="cursor:pointer;"
          class="angBtn propName"
        >重置</Button>
        <Button size="small" @click="now.nowAngle = 90" class="angBtn">90</Button>
        <Button size="small" @click="now.nowAngle = 180" class="angBtn">180</Button>
        <Button size="small" @click="now.nowAngle = 270" class="angBtn">270</Button>
        <hr class="divideHr" style="margin-top:5px;" />
        <span class="propName">X</span>
        <Input class="propInput" v-model="now.nowX" size="small" placeholder />
        <br />
        <span class="propName">Y</span>
        <Input class="propInput" v-model="now.nowY" size="small" placeholder />
        <br />
        <Button style="width:100%;margin-bottom:5px;" @click="change(null,'flip')">镜像翻转</Button>
        <!-- <Button style="width:100%;" type="primary" @click="change">设置</Button> -->
      </Card>
    </div>
    <div ref="dragCard2" class="draggable draggable2 dragCard">
      <div class="moveArea" @mousedown.stop="(e)=>mouseDown(e,'dragCard2')">拖拽移动</div>
      <Card>
        <p slot="title">区域&设备显示</p>
        <Tree
          @on-check-change="changeShowCheck"
          :check-strictly="true"
          node-key="id"
          :default-expanded-keys="[]"
          :auto-expand-parent="false"
          :data="showTree"
          :accordion="true"
          :default-expand-all="false"
          show-checkbox
        ></Tree>
      </Card>
    </div>
    <div v-if="!!bindPage" ref="dragCard3" class="draggable draggable3 dragCard">
      <div class="moveArea" @mousedown.stop="(e)=>mouseDown(e,'dragCard3')">拖拽移动</div>
      <Card v-if="!!bindPage">
        <p slot="title">库区（货架）详情</p>
        <p class="dp">库区名称：{{kqInfo.name}}</p>
        <p class="dp">储存条件：{{kqInfo.condition}}</p>
        <p class="dp">品类：{{kqInfo.category}}</p>
      </Card>
      <Card v-if="!!bindPage">
        <p slot="title">可绑定库区</p>
        <Table border :max-height="300" :columns="columnsKq" :data="dataKq"></Table>
        <!-- <Page style="margin:10px auto 0;" :total="40" size="small" show-total /> -->
      </Card>
    </div>

    <Modal
      class="kqModal"
      v-model="showModal"
      :title="`选择库区(${kqIsBind?'已匹配':'未匹配'})`"
      @on-ok="ok(kqIsBind)"
      @on-cancel="cancel"
      :ok-text="kqIsBind?'解绑':'绑定'"
      :width="300"
    >
      <Select
        v-if="!kqIsBind"
        @on-change="selectKqValueChange"
        style="width:200px;"
        v-model="selectKqValue"
        filterable
      >
        <Option v-for="(item) in dataKq" :value="item.areaId" :key="item.areaId">{{ item.areaCode }}</Option>
      </Select>
      <p class="dp">库区名称：{{kqInfo.name}}</p>
      <p class="dp">储存条件：{{kqInfo.condition}}</p>
      <p class="dp">品类：{{kqInfo.category}}</p>
    </Modal>
    <Modal v-model="preview" fullscreen title="预览图">
      <img style="max-width:100%;margin:0 auto;display:block;" :src="exportUrl" alt />
    </Modal>
    <Modal
      :closable="false"
      v-model="saveAndNext"
      title="请确认"
      ok-text="匹配货架"
      cancel-text="关闭页面"
      @on-ok="okS"
      @on-cancel="cancelS"
    >
      <p class="dp" style="margin-bottom:15px;">是否确认布局图绘制已完成？</p>
      <p class="dp">保存关闭页面。</p>
      <p class="dp">保存，继续匹配货架。</p>
    </Modal>
  </div>
</template>

<script>
let checkQueue = [];
let undoList = [];
let redoList = [];
let unit = 0.1;
let changeFn = () => {};

import { authMixin } from '@/mixins/auth.mixin.js';
import data from './data.json';

const fabric = window.fabric;
import { fUtils } from './fabricUtil';
import { getPreciseDistrictList, getRelevanceEquipmentIconList, savePaint, getDetailByWarehouseCode, getKqList, bindKq, unBindKq, kqDetail } from '@/apis/layout';
import { uploadFile } from '@/apis/baseConfig';
export default {
  name: 'dms-layout-warehouse-region',
  props: {
    msg: String
  },
  mixins: [authMixin],
  data: () => {
    return {
      showTopAbs: false, // 显示顶层操作canvas
      draggingItem: null, // 正在拖拽的元素
      showPage: true,
      width: 2000, // 画布宽
      height: 2000, // 画布高
      gap: 40, // 画标尺的空隙
      preview: false, // 是否预览
      exportUrl: '',
      now: {
        // 设置浮框
        nowName: '',
        nowColor: '#fff',
        nowTextColor: 'red',
        nowWidth: 0,
        nowHeight: 0,
        nowAngle: 0,
        nowX: 0,
        nowY: 0
      },
      showWidth: true, // 显示浮框宽
      showHeight: true,
      wallThickness: 14, // 墙的厚度
      scale: 1, // 缩放比例
      basicLocked: false, // 画布锁定
      activeArea: null,
      showModal: false,
      areaList: [], // 左侧区域列表
      deviceListObj: {}, // 左侧设备
      deviceSearchStr: '',
      collapseIndex: '1',
      showTree: [
        // 显示隐藏树型多选
        {
          title: '-',
          expand: false,
          children: []
        }
      ],
      columnsKq: [
        {
          title: '库区编码',
          key: 'areaCode'
        },
        {
          title: '库区名称',
          key: 'areaName'
        },
        {
          title: '存储条件',
          key: 'storeConditionValue'
        },
        {
          title: '品类',
          key: 'categoryName',
          render: (h, params) => {
            return h('div', params.row.categoryName.toString());
          }
        }
      ],
      dataKq: [], // 货架数据列表
      selectKqValue: 0,
      kqIsBind: false,
      kqInfo: {
        name: '',
        condition: '',
        category: '',
        areaCode: ''
      },
      nowDeviceItem: null, // 当前设备元素
      saveAndNext: false
    };
  },
  computed: {
    warehouseCode() {
      return this.$route.query.stationCode;
    },
    warehouseName() {
      return this.$route.query.stationName;
    },
    bindPage() {
      // 区分是否绑定设备页
      return this.$route.query.bindDevice == '1' ? 'bindPage' : '';
    },
    isDev() {
      return process.env.NODE_ENV == 'development';
    },
    isDetail() {
      // 区分是否查看页
      return this.$route.query.isDetail == '1';
    }
  },
  watch: {
    now: {
      handler(next) {
        this.change();
      },
      deep: true
    },
    draggingItem(next) {
      if (next) {
        this.showTopAbs = true;
      } else {
        this.showTopAbs = false;
      }
    },
    $route(next, prev) {
      if (next.query.bindDevice !== prev.query.bindDevice && next.path == '/dms/layout/warehouse/region') {
        window.location.reload();
      }
    },
    showTree(next) {
      // 开关可视
      this.changeShowCheck();
    },
    width(next) {
      this.canvas.setWidth(next);
      this.canvasTop.setWidth(next);
      this.canvasWrap.setWidth(Number(next) + this.gap * 2);
      this.$refs.topAbs.style.width = next + 'px';
      this.drawRuler();
    },
    height(next) {
      this.canvas.setHeight(next);
      this.canvasTop.setHeight(next);
      this.canvasWrap.setHeight(Number(next) + this.gap * 2);
      this.$refs.topAbs.style.height = next + 'px';
      this.drawRuler();
    },
    scale(next) {
      // 画布整体比例
      const wrapWidth = Number(this.width) * this.scale + this.gap * 2 + 'px';
      const wrapHeight = Number(this.height) * this.scale + this.gap * 2 + 'px';

      const width = this.width * this.scale + 'px';
      const height = this.height * this.scale + 'px';

      const set = (dom, w, h) => {
        dom.style.width = w;
        dom.style.height = h;
      };
      set(this.$refs.canvas, width, height);
      set(this.$refs.topAbs, width, height);
      set(this.$refs.canvas.children[0], width, height);
      set(this.$refs.canvas.children[0].children[0], width, height);
      set(this.$refs.canvas.children[0].children[1], width, height);
      set(this.$refs.topAbs.children[0], width, height);
      set(this.$refs.topAbs.children[0].children[0], width, height);
      set(this.$refs.topAbs.children[0].children[1], width, height);

      this.canvasWrap.setWidth(wrapWidth.slice(0, -2));
      this.canvasWrap.setHeight(wrapHeight.slice(0, -2));

      this.drawRuler();
    },
    deviceSearchStr(next) {
      // 左边栏搜索过滤设备
      if (!next) {
        if (this.originListObj) {
          this.deviceListObj = this.originListObj;
        }
        return;
      }
      const obj = {};
      for (let i in this.deviceListObj) {
        const list = [];
        this.deviceListObj[i].forEach(item => {
          if (item.equipmentName.indexOf(next) > -1) {
            list.push(item);
          }
        });
        if (list.length) obj[i] = list;
      }
      this.deviceListObj = obj;
    }
  },
  methods: {
    selectKqValueChange(val) {
      // 绑定货架时弹框中选择货架
      this.dataKq.forEach(item => {
        if (item.areaId == val) {
          let category = '';
          item.categoryName && (category = item.categoryName.toString());
          this.kqInfo = {
            name: item.areaName,
            condition: item.storeConditionValue,
            category: category,
            areaCode: item.areaCode
          };
        }
      });
    },
    change(o, f) {
      // 点击样式的“设置”按钮
      const obj = o || this.canvasTop.getActiveObject();
      const bottomObj = this.canvas.getActiveObject();
      const fn = obj => {
        if (obj && obj.oType && obj.oType != 'activeSelection') {
          if (obj.oType == 'area' || obj.oType == 'device') {
            obj._objects[0].set('fill', this.now.nowColor);
            const originName = obj.busInfo.equipmentName || obj.busInfo.districtName;
            // if (this.now.nowName.indexOf(originName) != 0 && this.now.nowName != originName) this.now.nowName = originName + ' ' + this.now.nowName;
            obj._objects[1].set('text', this.now.nowName);
            obj._objects[1].set('fill', this.now.nowTextColor);
            // obj._objects[2].set('fill', this.now.nowTextColor);
            // obj._objects[3].set('fill', this.now.nowTextColor);
            // obj._objects[4].set('fill', this.now.nowTextColor);
            // obj._objects[4].set('text', this.now.nowAngle + '°');
            if (obj.oType == 'device') {
              fUtils.rectGroupModified(this, obj, null, null, this.now.nowAngle, this.now.nowX, this.now.nowY);
            } else {
              fUtils.rectGroupModified(this, obj, this.now.nowWidth, this.now.nowHeight, this.now.nowAngle, this.now.nowX, this.now.nowY);
            }
          }
          if (obj.oType == 'wall') {
            obj._objects[2].set('text', this.now.nowAngle + '°');
            fUtils.wallGroupModified(this, obj, this.now.nowWidth, this.now.nowAngle, this.now.nowX, this.now.nowY);
          }
          if (f == 'flip' && obj.oType == 'device') {
            obj._objects[0].set('scaleX', -1);
          }
          obj.setCoords();
          this.canvasTop.renderAll();
          // fUtils.checkOverlapping.call(this.canvas);
          // fUtils.recordOld.call(obj, null, this);
          // this.canvas.remove(obj);
          // this.canvas.add(obj);
          // this.canvas.setActiveObject(obj);
        }
      };
      fn(obj);
      fn(bottomObj);
      if (this.nowDeviceItem) {
        this.nowDeviceItem._objects[1].set('text', this.now.nowName);
        this.canvas.renderAll();
      }
    },
    exportFile() {
      // 导出图片到本地
      this.exportPng(true, () => {}, true);
    },
    exportPng(upload, cb, download) {
      // 上传图片方法
      this.canvas.discardActiveObject();
      const fabric = window.fabric;
      const scale = this.scale;
      this.scale = 1;
      fabric.Image.fromURL(this.canvas.toDataURL('png'), oImg => {
        oImg.set({
          top: this.gap,
          left: this.gap,
          crossOrigin: 'Anonymous'
        });
        this.canvasWrap.add(oImg);
        this.exportUrl = this.canvasWrap.toDataURL('png');
        if (download) {
          // 创建隐藏的可下载链接
          var eleLink = document.createElement('a');
          eleLink.download = this.warehouseName + '微仓布局图.png';
          eleLink.style.display = 'none';
          // 字符内容转变成blob地址
          // var blob = new Blob([content]);
          eleLink.href = this.exportUrl;
          // 触发点击
          document.body.appendChild(eleLink);
          eleLink.click();
          // 然后移除
          document.body.removeChild(eleLink);
          return;
        }
        this.scale = scale;
        if (!upload) {
          this.preview = true;
        } else {
          function dataURLtoBlob(dataurl) {
            var arr = dataurl.split(','),
              mime = arr[0].match(/:(.*?);/)[1],
              bstr = atob(arr[1]),
              n = bstr.length,
              u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], {
              type: mime
            });
          }

          const formData = new FormData();
          formData.append('file', new File([dataURLtoBlob(this.exportUrl)], 'paint.png', { type: 'image/png' }));
          this.uploadImg(formData, cb);
        }
      });
    },
    drawRuler() {
      fUtils.drawRuler(this.canvasWrap, this.gap, this.width * this.scale, this.height * this.scale, this.scale);
    },
    scaleFn(bool) {
      if (bool) {
        if (this.scale <= 1.8) {
          this.scale = (this.scale * 10 + 2) / 10;
        }
      } else {
        if (this.scale >= 0.7) {
          this.scale = (this.scale * 10 - 2) / 10;
        }
      }
    },
    addRect(params = {}) {
      const fabric = window.fabric;
      fUtils.addRect(this, null, null, null, null, params.oType, null, params.x, params.y, params.name, params.color, params.busInfo);
      this.refreshTree();
    },
    addWall(params) {
      const fabric = window.fabric;
      fUtils.addWall(this);
    },
    addDevice(params = {}) {
      const fabric = window.fabric;
      fUtils.addDevice(this, params, this.refreshTree);
    },
    saveData() {
      this.canvas.discardActiveObject();
      this.checkOver(result => {
        if (result !== true) {
          this.$Notice.open({
            title: '校验不通过，不允许提交',
            desc: result
          });
          return;
        }
        // 生成业务数据
        const userInfo = this.$store.state.user.userInfo.data.sysUser;
        const districtDTOList = [];
        this.canvas.forEachObject(item => {
          if (item.oType == 'area') {
            const layoutEquipmentDTOList = [];
            this.canvas.forEachObject(_item => {
              if (_item.oType == 'device' && _item.isContained == item.uuid) {
                let obj = {
                  equipmentId: _item.busInfo.id,
                  data: _item.item(1).text,
                  remark: '-',
                  forntUid: _item.uuid
                };
                if (_item.busInfo.bInfo) {
                  obj = {
                    ...obj,
                    ..._item.busInfo.bInfo,
                    data: _item.item(1).text
                  };
                }
                layoutEquipmentDTOList.push(obj);
              }
            });
            let obj = {
              districtId: item.busInfo.id,
              data: item.item(1).text,
              remark: '-',
              forntUid: item.uuid
            };
            if (item.busInfo.bInfo) {
              obj = {
                ...obj,
                ...item.busInfo.bInfo,
                data: item.item(1).text
              };
            }
            obj.layoutEquipmentDTOList = layoutEquipmentDTOList;
            districtDTOList.push(obj);
          }
          if (item.oType == 'wall') {
            // 未确定
            districtDTOList.push({
              districtId: -1,
              data: '墙',
              remark: '-',
              forntUid: item.uuid,
              layoutEquipmentDTOList: []
            });
          }
        });
        const layoutEquipmentDTOList = []; // 不属于任何区域设备
        this.canvas.forEachObject(item => {
          if (item.oType == 'device' && item.busInfo.equipmentBelong == 0) {
            let obj = {
              equipmentId: item.busInfo.id,
              data: item.item(1).text,
              remark: '-',
              forntUid: item.uuid
            };
            if (item.busInfo.bInfo) {
              obj = {
                ...obj,
                ...item.busInfo.bInfo,
                data: item.item(1).text
              };
            }
            layoutEquipmentDTOList.push(obj);
          }
        });

        if (!districtDTOList.length) {
          this.$Notice.open({
            title: '校验不通过',
            desc: '不能保存空画布'
          });
          return;
        }
        this.exportPng(true, url => {
          savePaint({
            layoutType: 1,
            createUserId: 121,
            createUserName: 'wangwu',
            // existedLayout: 1,
            // enabledDms: 1,
            layoutData: JSON.stringify({
              // 纯画图数据
              rulerData: {
                width: this.width,
                height: this.height
              },
              canvasData: this.canvas.toJSON(['oType', 'uuid', 'busInfo'])
            }),
            // layoutJson: 'josn数据测试',
            layoutUrl: url,
            warehouseCode: this.warehouseCode,
            warehouseName: this.warehouseName,
            districtDTOList: districtDTOList, // 区域、设备业务逻辑数据
            layoutEquipmentDTOList: layoutEquipmentDTOList // 不属于任何区域的设备业务逻辑数据
          }).then(res => {
            if (res.code == 200) {
              window.onbeforeunload = null;
              this.saveAndNext = true;
            }
          });
        });

        // if (!this.canvas._objects.length) return;
        // localStorage['canvasData'] = JSON.stringify({
        //   rulerData: {
        //     width: this.width,
        //     height: this.height
        //   },
        //   canvasData: this.canvas.toJSON(['oType', 'uuid', 'busInfo'])
        // });
      });
    },
    loadData(d, isUndo, lock, bindInfos) {
      const idObj = {};
      if (bindInfos) {
        // 储存业务逻辑
        bindInfos.forEach(item => {
          idObj[item.forntUid] = item;
          item.layoutEquipmentDTOList &&
            item.layoutEquipmentDTOList.forEach(_item => {
              idObj[_item.forntUid] = _item;
            });
        });
      }

      const data = d || JSON.parse(localStorage['canvasData'] || '{}');
      if (data && Object.keys(data).length > 0) {
        this.width = data.rulerData.width;
        this.height = data.rulerData.height;
        this.canvas.loadFromJSON(data.canvasData, () => {
          this.canvas.forEachObject(item => {
            if (item.oType == 'device' && idObj[item.uuid]) {
              // 赋予业务逻辑
              item.busInfo.bid = idObj[item.uuid].id;
              item.busInfo.areaId = idObj[item.uuid].areaId;
              item.busInfo.dataStr = idObj[item.uuid].data;
              if (idObj[item.uuid].areaId) {
                item.busInfo.areaCode = idObj[item.uuid].areaCode;
                item.busInfo.areaName = idObj[item.uuid].areaName;
                item._objects[1].set({
                  text: idObj[item.uuid].areaCode,
                  fill: '#EA1A1A'
                });
              } else {
                item._objects[1].set({
                  fill: '#000'
                });
                if (idObj[item.uuid].data) {
                  item._objects[1].set({
                    text: idObj[item.uuid].data
                  });
                }
              }
            }
            if (idObj[item.uuid]) {
              item.busInfo && (item.busInfo.bInfo = idObj[item.uuid]);
            }
            if (item.oType) {
              fUtils[
                'make' +
                  item.oType.replace(/^./, s => {
                    return s.toUpperCase();
                  }) +
                  'Alive'
              ](item, this);
            }
          });
          this.canvas.renderAll();
          if (!isUndo || undoList.length == 0) this.recordUndoList();
          this.refreshTree();
          if (lock) {
            // 匹配货架页面，锁定所有元素不可编辑
            this.lockBasis();
            this.canvas.set('selections', false);
          }
          this.canvas.set('backgroundColor', '#fefefe');
        });
        // this.lockBasis(false);
      }
    },
    checkOver(cb) {
      if (this.showTopAbs) return;
      // 校验画布合法性
      if (checkQueue.indexOf(this.checkOverFn) < 0) {
        checkQueue.push(this.checkOverFn);
      }
      clearInterval(this.checkQueueTimer);
      this.checkQueueTimer = setTimeout(() => {
        while (checkQueue.length) {
          const fn = checkQueue.pop();
          if (typeof cb == 'function') {
            cb(fn());
          } else {
            fn();
          }
        }
        this.canvas.renderAll();
      });
    },
    checkOverFn() {
      // 具体校验
      let reasons = [];
      let canPass = !fUtils.checkOverlapping.call(this.canvas, null, this);
      if (!canPass) reasons.push('区域有重叠');
      // this.canvas.discardActiveObject();
      const list = fUtils.checkObjOverflow(this);
      if (list.length) reasons.push('画布外存在元素');
      for (let i = 0; i < this.canvas._objects.length; i++) {
        if (this.canvas._objects[i].oType == 'device') {
          if (!fUtils.checkContain({ target: this.canvas._objects[i] }, this)) reasons.push(`设备"${this.canvas._objects[i].busInfo.equipmentName}"放置区域有误，应归于所属区域内`);
        }
      }
      if (reasons.length) return reasons.join('<br>');
      return true;
    },
    deleteObj() {
      // 删除元素
      const fn = obj => {
        if (obj.oType == 'area') {
          for (let i = 0; i < this.canvas._objects.length; i++) {
            if (this.canvas._objects[i].oType == 'device') {
              if (this.canvas._objects[i].isContained == obj.uuid) {
                this.$Message.warning('不允许删除已绑定设备的区域');
                return true;
              }
            }
          }
        }
        if (obj.oType == 'device' && obj.busInfo.bInfo && obj.busInfo.bInfo.areaId) {
          this.$Message.warning('不允许删除已绑定的设备');
          return true;
        }
        if (obj.oType) {
          this.canvas.remove(obj);
          this.canvasTop.forEachObject(item => {
            this.canvasTop.remove(item);
          });
          this.showTopAbs = false;
          return true;
        }
        return false;
      };
      let obj;
      if ((obj = this.canvas.getActiveObject())) {
        // 多选，遍历检测是否可删除
        if (!fn(obj)) {
          if (obj._objects) {
            obj._objects.forEach(item => {
              fn(item);
            });
          }
        }
      }
      this.refreshTree();
    },
    lockBasis(bool) {
      // 锁定画布，变为绑定界面
      this.canvas.discardActiveObject();
      this.canvas.forEachObject(item => {
        item.set({
          selectable: false,
          hoverCursor: 'default'
        });
        if (item.oType == 'device') {
          item.set({
            hoverCursor: 'pointer'
          });
        }
        if (item.oType == 'device' && this.isDetail) {
          item.on('mousedblclick', e => {
            if (e.target.busInfo.areaId) {
              this.nowDeviceItem = e.target;
              this.$emit('detailJump', { areaCode: e.target.busInfo.bInfo.areaCode });
            }
          });
        }
        if (item.oType == 'device' && !this.isDetail) {
          item._objects[2].set('opacity', 0);
          item._objects[3].set('opacity', 0);
          item._objects[4].set('opacity', 0);
          item.on('mousedblclick', e => {
            if (!e.target.busInfo.areaId) {
              this.kqIsBind = false;
            } else {
              this.kqIsBind = true;
            }
            this.kqInfo = {
              name: '',
              condition: '',
              category: '',
              areaCode: ''
            };
            this.selectKqValue = 0;
            this.nowDeviceItem = e.target;
            this.showModal = true;
          });
          item.on('mousedown', e => {
            clearTimeout(this.downTimer);
            this.downTimer = setTimeout(() => {
              this.canvas.forEachObject(_item => {
                if (_item.oType == 'device') {
                  _item.opacity = 0.5;
                }
              });
              item.opacity = 1;
              this.canvas.renderAll();

              if (!e.target.busInfo.areaId) {
                this.kqInfo = {};
              }

              this.nowDeviceItem = e.target;
              kqDetail({
                warehouseCode: this.warehouseCode,
                areaId: this.nowDeviceItem.busInfo.areaId
              }).then(res => {
                if (res.code == 200) {
                  let category = '';
                  res.result.categories.forEach(item => {
                    category += item.categoryName + ' ';
                  });
                  this.kqInfo = {
                    name: res.result.areaName,
                    condition: res.result.storeConditionValue,
                    category: category,
                    areaCode: res.result.areaCode
                  };
                }
              });
            }, 300);
          });
        }
      });
      this.canvas.renderAll();
      this.basicLocked = true;
      // if (!bool) {
      //   this.activeArea = null;
      //   this.canvas.forEachObject(item => {
      //     if (item.oType == 'area') {
      //       item._objects[0].set({
      //         strokeWidth: 0
      //       });
      //     }
      //   });
      // }
      // this.canvas.discardActiveObject();
      // this.canvas.forEachObject(item => {
      //   if (item.oType == 'wall' || item.oType == 'area') {
      //     item.set({
      //       selectable: !bool,
      //       opacity: bool ? 0.3 : 0.9
      //     });
      //   }
      // });
      // this.canvas.renderAll();
    },
    recordUndoList() {
      // 记录撤销
      redoList = [];
      if (undoList.length > 20) {
        undoList.shift();
      }
      undoList.push(
        JSON.stringify({
          rulerData: {
            width: this.width,
            height: this.height
          },
          canvasData: this.canvas.toJSON(['oType', 'uuid', 'busInfo'])
        })
      );
    },
    redo() {
      // 重做
      if (redoList.length) {
        const state = redoList.pop();
        undoList.push(state);
        this.loadData(JSON.parse(state), true);
      }
    },
    undo() {
      // 撤销
      if (undoList.length) {
        if (undoList.length) {
          const state = undoList.pop();
          redoList.push(state);
          if (undoList.length) {
            this.loadData(JSON.parse(undoList[undoList.length - 1]), true);
          } else {
            this.loadData(JSON.parse(state), true);
          }
        }
      }
    },
    move(dirction) {
      // 键盘上下左右移动
      if (!this.speedTimer) {
        this.speedTimer = setInterval(() => {
          unit = unit + 0.1;
        }, 100);
      }
      let obj;
      if ((obj = this.canvas.getActiveObject())) {
        switch (dirction) {
          case 'up':
            obj.set({
              top: obj.top + -unit
            });
            break;
          case 'down':
            obj.set({
              top: obj.top + unit
            });
            break;
          case 'left':
            obj.set({
              left: obj.left - unit
            });
            break;
          case 'right':
            obj.set({
              left: obj.left + unit
            });
            break;
          default:
            break;
        }
        // obj.setCoords()
        // fUtils.recordOld.call(obj, { target: obj }, this);
        obj.fire('modified', true);
        // if ((!obj.isOverlapping && obj.oType != 'device') || (obj.isContained && obj.oType == 'device')) {
        this.canvas.fire('object:modified');
        // this.canvas.renderAll();
        // }
      }
    },
    mouseDown(e, dragCard) {
      // 可拖拽的卡片通用逻辑
      Array.prototype.forEach.call(document.getElementsByClassName('dragCard'), item => {
        if (item == this.$refs[dragCard]) {
          item.style.zIndex = 1002;
        } else {
          item.style.zIndex = 1001;
        }
      });
      this.$refs[dragCard].nX = e.offsetX;
      this.$refs[dragCard].nY = e.offsetY;
      // this.oldOnMouseMove = window.onmousemove;
      // this.oldOnMouseUp = window.onmouseup;
      window.onmousemove = _e => {
        this.$refs[dragCard].style.left = _e.x - this.$refs[dragCard].nX + 'px';
        this.$refs[dragCard].style.top = _e.y - this.$refs[dragCard].nY + 'px';
      };
      window.onmouseup = () => {
        window.onmousemove = null;
        window.onmouseup = null;
      };
    },
    dropObj(e) {
      // 左侧拖拽dom后显示在画布中
      if (this.draggingItem) {
        switch (this.draggingItem.oType) {
          case 'area':
            this.addRect({
              oType: 'area',
              x: Math.floor((e.offsetX / this.scale) * 10) / 10,
              y: Math.floor((e.offsetY / this.scale) * 10) / 10,
              name: this.draggingItem.districtName,
              color: this.draggingItem.color,
              busInfo: {
                ...this.draggingItem,
                districtId: this.draggingItem.id
              }
            });
            break;
          case 'device':
            this.addDevice({
              oType: 'device',
              x: Math.floor((e.offsetX / this.scale) * 10) / 10,
              y: Math.floor((e.offsetY / this.scale) * 10) / 10,
              name: this.draggingItem.equipmentName,
              url: this.draggingItem.iconUrl,
              w: this.draggingItem.length,
              h: this.draggingItem.width,
              busInfo: {
                ...this.draggingItem,
                deviceId: this.draggingItem.id,
                districtId: this.draggingItem.districtId
              }
            });
            break;
          default:
            break;
        }
      }
      this.draggingItem = null;
    },
    dragArea(e, item) {
      this.draggingItem = item;
    },
    dragDevice(e, item) {
      this.canvas.discardActiveObject();
      this.draggingItem = item;
    },
    refreshTree() {
      // 刷新控制显示的树
      clearTimeout(this.refreshTreeTimer);
      this.refreshTreeTimer = setTimeout(() => {
        const tree = [];
        this.canvas.forEachObject(item => {
          if (item.oType == 'area') {
            const children = [];
            this.canvas.forEachObject(_item => {
              if (_item.oType == 'device' && _item.isContained == item.uuid) {
                _item.hasAreaInPaint = true;
                children.push({
                  title: (_item.busInfo.areaId && _item.busInfo.areaCode) || _item.item(1).text,
                  checked: typeof _item.checked == 'boolean' ? _item.checked : true,
                  obj: _item,
                  id: _item.uuid
                });
              }
            });
            tree.push({ title: item.item(1).text, expand: false, checked: typeof item.checked == 'boolean' ? item.checked : true, children: children, obj: item, id: item.uuid });
          }
        });
        const children = [];
        this.canvas.forEachObject(_item => {
          if (_item.oType == 'device' && (!_item.isContained || _item.isContained == 'out')) {
            children.push({
              title: (_item.busInfo.areaId && _item.busInfo.areaCode) || _item.item(1).text,
              checked: typeof _item.checked == 'boolean' ? _item.checked : true,
              obj: _item,
              id: _item.uuid
            });
          }
        });
        if (children.length) {
          tree.push({ title: '-', expand: false, checked: true, children: children, id: 0 });
        }
        this.showTree = tree;
      }, 200);
    },
    changeShowCheck() {
      if(this.bindPage) return
      // 改变可视数据
      const fn = o => {
        if (!o.obj) return;
        if (o.checked) {
          if (o.obj.oldOpa) {
            o.obj.opacity = o.obj.oldOpa;
          }
          o.checked = true;
          o.obj.checked = true;
          o.obj.set('selectable', true);
        } else {
          o.obj.oldOpa = o.obj.opacity || 0.7;
          o.obj.opacity = 0;
          o.obj.checked = false;
          o.obj.set('selectable', false);
          o.checked = false;
        }
      };
      this.showTree.forEach(item => {
        fn(item);
        if (item.children && item.children.length) {
          item.children.forEach(_item => {
            fn(_item);
          });
        }
      });
      this.canvas.renderAll();
    },
    ok(unbind) {
      // 绑定点击
      if (this.nowDeviceItem) {
        if (unbind) {
          unBindKq({
            // 解绑
            id: this.nowDeviceItem.busInfo.bid,
            areaId: this.nowDeviceItem.busInfo.areaId
          }).then(res => {
            if (res.code == 200) {
              this.nowDeviceItem.busInfo.areaId = 0;
              this.nowDeviceItem._objects[1].set({
                text: this.nowDeviceItem.busInfo.dataStr,
                fill: '#000'
              });
              this.canvas.renderAll();
              this.getKqList();
            }
          });
        } else {
          if (!this.selectKqValue) {
            this.$Message.warning('绑定失败，库区必选');
            return false;
          }
          bindKq({
            // 绑定
            id: this.nowDeviceItem.busInfo.bid,
            areaId: this.selectKqValue,
            layoutId: this.layoutId
          }).then(res => {
            if (res.code == 200) {
              this.nowDeviceItem.busInfo.areaId = this.selectKqValue;
              this.nowDeviceItem.busInfo.areaName = this.kqInfo.name;
              this.nowDeviceItem.busInfo.areaCode = this.kqInfo.areaCode;
              this.nowDeviceItem._objects[1].set({
                text: this.kqInfo.areaCode,
                fill: '#EA1A1A'
              });
              this.canvas.renderAll();
              this.getKqList();
            }
          });
        }
      } else {
        this.$Message.info('无选中设备');
      }
    },
    cancel() {},
    loadByNet(bool) {
      // 远程加载
      getDetailByWarehouseCode({
        warehouseCode: this.warehouseCode,
        layoutType: 1
      }).then(res => {
        if (this.isDev) {
          res = data;
        }
        if (res.code == 200) {
          if (res.result && res.result.layoutData) {
            const data = res.result.layoutData;
            const bindInfos = res.result.districtDTOList;
            this.layoutId = res.result.id;
            this.loadData(JSON.parse(data), null, bool, bindInfos);
          }
        }
      });
    },
    uploadImg(data, cb) {
      uploadFile(data).then(res => {
        cb(res.result);
      });
    },
    getKqList() {
      // 绑定时获取货架列表
      getKqList({ warehouseCode: this.warehouseCode }).then(res => {
        if (res.code == 200) {
          this.dataKq = res.result;
        }
      });
    },
    okS() {
      // 画完布局图按确定，去绑定货架逻辑
      // this.$router.replace({
      //   path: this.$route.path,
      //   query: {
      //     bindDevice: '1',
      //     stationName: this.warehouseName,
      //     stationCode: this.warehouseCode
      //   }
      // });
      // window.location.reload();
      window.location.replace(`/#/dms/layout/warehouse/region?bindDevice=1&stationName=${this.warehouseName}&stationCode=${this.warehouseCode}`);
    },
    cancelS() {
      window.close();
    },
    cancelSP() {
      window.MICRO_CLOSE_TAB(this.$route);
    },
    toChenlie() {
      // 跳到陈列
      if (this.nowDeviceItem && this.nowDeviceItem.busInfo.areaId) {
        window.open(
          `/#/dms/layout/warehouse/slocation?newWindow=true&noBrainNav=true&stationCode=${this.warehouseCode}&stationName=${this.warehouseName}&areaCode=${this.nowDeviceItem.busInfo.areaCode}`,
          'micro'
        );
      } else {
        window.open(`/#/dms/layout/warehouse/slocation?newWindow=true&noBrainNav=true&stationCode=${this.warehouseCode}&stationName=${this.warehouseName}`, 'micro');
        // this.$Message.warning('未选择已绑定的库区');
      }
    },
    getCurrentEqu() {
      // 获取当前点击已绑定设备的货架信息
      getRelevanceEquipmentIconList({
        equipmentStatus: 1
      }).then(res => {
        if (res.code == 200) {
          const obj = res.result;
          for (let i in obj) {
            obj[i] = obj[i].map(item => {
              item.oType = 'device';
              return item;
            });
          }
          this.deviceListObj = obj;
          this.originListObj = JSON.parse(JSON.stringify(obj) || '{}');
        }
      });
    }
  },
  async mounted() {
    const fabric = window.fabric;
    // fabric.Object.prototype.noScaleCache = false;
    const canvas = (window.canvasC = this.canvas = new fabric.Canvas('canvas', {
      // 画核心canvas
      backgroundColor: '#fefefe',
      renderOnAddRemove: false,
      enableRetinaScaling: false,
      centeredRotation: true
      // allowTouchScrolling: false,
      // isDrawingMode:false,
      // prepareObjectStacking:true,
      // skipTargetFind:true
    }));
    canvas.setWidth(this.width);
    canvas.setHeight(this.height);
    if (!this.bindPage) {
      document.onmousedown = function(e) {
        let node = e.target;
        while (node) {
          if (node.id == 'areaDrag' || node.id == 'deviceDrag') {
            changeFn();
            return;
          } else {
            node = node.parentNode;
          }
        }
        // if (e.target.tagName !== 'CANVAS') {
        //   changeFn();
        // }
      };
      // let event = null
      // document.addEventListener('mousedown',e=>{event = e})
      canvas.on('mouse:down', e => {
        // 将选中元素的属性展示到活动卡片上
        const obj = this.canvas.getActiveObject();
        if (obj && obj.type != 'activeSelection') {
          obj.set('opacity', 0);
          this.canvas.renderAll();
          this.showTopAbs = true;
          obj.clone(
            o => {
              fUtils[
                'make' +
                  o.oType.replace(/^./, s => {
                    return s.toUpperCase();
                  }) +
                  'Alive'
              ](o, this, 'upper');
              o.set({
                hasControls: true,
                hasBorders: true,
                opacity: o.oType == 'area' ? 0.7 : 1
              });
              this.canvasTop.add(o);
              this.canvasTop.setActiveObject(o);
              changeFn = () => {
                obj.setOptions(o.toJSON());
                // this.change(obj);
                obj.opacity = obj.oType == 'area' ? 0.7 : 1;
                obj.fire('modified');
                this.canvasTop.remove(o);
                this.showTopAbs = false;
                this.canvas.discardActiveObject();
                // document.dispatchEvent(event)
                changeFn = () => {};
              };
              o.on('deselected', e => {
                changeFn(e);
              });
            },
            ['oType', 'uuid', 'busInfo']
          );
        }

        if (obj && (obj.oType == 'area' || obj.oType == 'device')) {
          this.now.nowName = obj._objects[1].text;
          this.now.nowColor = obj._objects[0].fill;
          this.now.nowTextColor = obj._objects[1].fill;
          this.now.nowWidth = obj.width;
          this.now.nowHeight = obj.height;
          this.now.nowAngle = obj.angle;
          this.now.nowX = obj.left;
          this.now.nowY = obj.top;
        }
        if (obj && obj.oType == 'wall') {
          this.now.nowWidth = obj.width;
          this.now.nowHeight = obj.height;
          this.now.nowAngle = obj.angle;
          this.now.nowX = obj.left;
          this.now.nowY = obj.top;
        }
        // if (e.target && e.target.oType == 'area' && this.basicLocked) {
        //   this.canvas.forEachObject(item => {
        //     if (item.oType == 'area') {
        //       item.opacity = 0.3;
        //       item._objects[0].set({
        //         strokeWidth: 0
        //       });
        //     }
        //   });
        //   this.activeArea = e.target;
        //   e.target.opacity = 0.9;
        //   e.target._objects[0].set({
        //     strokeWidth: 1,
        //     stroke: '#000'
        //   });
        //   this.canvas.renderAll();
        // }
      });
      canvas.on('mouse:up', e => {
        // 处理一些显示逻辑
        const vm = this;
        const obj = this.canvas.getActiveObject();

        if (obj && obj.type == 'activeSelection') {
          obj.hasControls = false;
          obj.set({ borderDashArray: [3, 3] });
          this.canvas.renderAll();
        }
        // canvas.forEachObject(item => {
        //   if (item.oType == 'device') {
        //     canvas.bringForward(item);
        //     canvas.bringToFront(item);
        //   }
        // });
        if (obj && obj.oType == 'area') {
          this.showWidth = true;
          this.showHeight = true;
        } else if (obj && obj.oType == 'wall') {
          this.showWidth = true;
          this.showHeight = false;
        } else {
          this.showWidth = false;
          this.showHeight = false;
        }
      });
      canvas.on({
        // 校验、撤销、刷新显示树
        // 'object:added': () => {
        //   this.checkOver();
        //   this.refreshTree();
        // },
        // 'object:modified': () => {
        //   this.recordUndoList();
        // },
        // 'object:scaled': () => {
        //   this.checkOver();
        //   this.refreshTree();
        // },
        'selection:cleared': () => {
          this.checkOver();
        }
        // 'object:rotated': () => {
        //   this.checkOver();
        //   this.refreshTree();
        // },
        // 'object:skewed': () => {
        //   this.checkOver();
        //   this.refreshTree();
        // },
      });
    }

    const canvasWrap = (window.canvasWrap = this.canvasWrap = window.bbb = new fabric.Canvas('canvasWrap', {
      // 画尺寸的canvas
      backgroundColor: '#fff',
      selection: false
    }));
    const gap = this.gap;
    canvasWrap.setWidth(this.width + gap * 2);
    canvasWrap.setHeight(this.height + gap * 2);
    this.$refs.topAbs.style.width = this.width + 'px';
    this.$refs.topAbs.style.height = this.height + 'px';
    this.$refs.topAbs.style.top = this.gap + 'px';
    this.$refs.topAbs.style.left = this.gap + 'px';
    this.drawRuler();

    const canvasTop = (this.canvasTop = new fabric.Canvas('canvasTop', {
      backgroundColor: 'rgba(0,0,0,0)'
    }));
    canvasTop.setWidth(this.width);
    canvasTop.setHeight(this.height);

    // 业务逻辑
    if (this.bindPage) {
      this.loadByNet(true);
      this.getKqList();
    } else if (!this.isDetail) {
      this.loadByNet(false);
      getPreciseDistrictList({
        districtStatus: 1
      }).then(res => {
        if (res.code == 200) {
          this.areaList = res.result.map(item => {
            item.oType = 'area';
            return item;
          });
        }
      });
      this.getCurrentEqu();
    } else if (this.isDetail) {
      this.loadByNet(true);
    }
  },
  activated() {
    if (this.isDetail) return;
    if (!this.bindPage) {
      window.onbeforeunload = function(e) {
        const msg = '您还没有保存，确定退出吗?';
        e.returnValue = msg;
        return msg;
      };
    }
    if (this.bindPage) return;

    this.oldKeyDown = window.onkeydown;

    window.onkeydown = e => {
      // 键盘功能开启
      if (e.keyCode == 8 && e.shiftKey) {
        let obj;
        this.deleteObj();
      }
      if ((e.ctrlKey || (e.metaKey && !e.shiftKey)) && e.keyCode == 90) {
        this.undo();
      }
      if ((e.ctrlKey && e.keyCode == 89) || (e.metaKey && e.shiftKey && e.keyCode == 90)) {
        this.redo();
      }
      if (e.keyCode == 38) {
        e.preventDefault();
        this.move('up');
      }
      if (e.keyCode == 40) {
        e.preventDefault();
        this.move('down');
      }
      if (e.keyCode == 37) {
        e.preventDefault();
        this.move('left');
      }
      if (e.keyCode == 39) {
        e.preventDefault();
        this.move('right');
      }
    };
    window.onkeyup = e => {
      clearInterval(this.speedTimer);
      this.speedTimer = null;
      unit = 0.1;
    };
  },
  deactivated() {
    window.onkeydown = this.oldKeyDown;
    window.onkeyup = this.oldKeyUp;
  },
  beforeDestroy() {
    this.canvas.dispose();
    this.canvasWrap.dispose();
  }
};
</script>

<style scoped lang="scss">
@import './region.scss';
</style>
