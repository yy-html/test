const wallHieght = 14;
const defaultOpacity = 0.7
const multiple = 1
const posMultiple = 10
export let fUtils = {
    generateGuuId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    drawRuler(canvasWrap, gap, width, height, scale) { // 画标尺
        let fabric = window.fabric;
        canvasWrap.clear();
        var textWidth = new fabric.Text(String((width / scale).toFixed()) + 'cm', {
            fontSize: 14,
            left: width / 2 + gap,
            originX: 'center',
            originY: 'center',
            top: 10,
            hasControls: false,
            selectable: false
        });

        var textHeight = new fabric.Text(String((height / scale).toFixed()) + 'cm', {
            fontSize: 14,
            top: height / 2 + gap,
            originY: 'center',
            originX: 'center',
            left: 10,
            angle: 270,
            hasControls: false,
            selectable: false
        });
        let line1 = new fabric.Line([gap, 0 + gap / 4, gap, (gap * 3) / 4], {
            strokeWidth: 1,
            stroke: '#000',
            selectable: false
        });
        let line2 = new fabric.Line([Number(width) + gap, 0 + gap / 4, Number(width) + gap, (gap * 3) / 4], {
            strokeWidth: 1,
            stroke: '#000',
            selectable: false
        });
        let line3 = new fabric.Line([gap, gap / 2, Number(width) + gap, gap / 2], {
            strokeWidth: 1,
            stroke: '#000',
            selectable: false
        });
        let line4 = new fabric.Line([0 + gap / 4, gap, (gap * 3) / 4, gap], {
            strokeWidth: 1,
            stroke: '#000',
            selectable: false
        });
        let line5 = new fabric.Line([0 + gap / 4, Number(height) + gap, (gap * 3) / 4, Number(height) + gap], {
            strokeWidth: 1,
            stroke: '#000',
            selectable: false
        });
        let line6 = new fabric.Line([gap / 2, gap, gap / 2, Number(height) + gap], {
            strokeWidth: 1,
            stroke: '#000',
            selectable: false
        });
        canvasWrap.add(line1, line2, line3, line4, line5, line6, textWidth, textHeight);
    },
    checkOverlapping(e, vm) { // 检测设备在正确区域以及检测区域重叠
        let list = []
        if (e && e.target) {
            if (e.target.oType == 'device') {
                fUtils.checkContain(e, vm)
                return
            }
            if (e.target.oType == 'area' || e.target.oType == 'wall') {
                for (let j = 0; j < this._objects.length; j++) {
                    this._objects[j].setCoords()
                    this._objects[j].isOverlapping = false
                    if (this._objects[j].checked !== false) this._objects[j].set('opacity', defaultOpacity);
                    if ((this._objects[j].oType != 'wall' && this._objects[j].oType != 'area') || this._objects[j] == e.target) {
                        continue
                    }
                    if (this._objects[j].intersectsWithObject(e.target)) {
                        if (list.indexOf(this._objects[j]) < 0) {
                            list.push(this._objects[j])
                        }
                        if (list.indexOf(e.target) < 0) {
                            list.push(e.target)
                        }
                    }
                }
            }
        } else {
            for (let i = 0; i < this._objects.length; i++) {
                if (!this._objects[i].oType || (this._objects[i].oType != 'wall' && this._objects[i].oType != 'area')) {
                    continue
                }
                this._objects[i].setCoords()
                this._objects[i].isOverlapping = false
                if (this._objects[i].checked !== false) this._objects[i].set('opacity', defaultOpacity);
                for (let j = i + 1; j < this._objects.length; j++) {
                    if ((this._objects[j].oType != 'wall' && this._objects[j].oType != 'area') || (this._objects[i].oType == 'wall' && this._objects[j].oType == 'wall')) {
                        continue
                    }
                    if (this._objects[j].intersectsWithObject(this._objects[i])) {
                        if (list.indexOf(this._objects[j]) < 0) {
                            list.push(this._objects[j])
                        }
                        if (list.indexOf(this._objects[i]) < 0) {
                            list.push(this._objects[i])
                        }
                    }
                }
            }
        }
        list.forEach(item => {
            item.isOverlapping = true
            if (item.checked !== false) item.set('opacity', 0.3)
        })
        // this.renderAll()
        let bool = list.length > 0
        list = null
        return bool
    },
    checkContain(e, vm) { // 检测设备在正确区域并标记
        if (!e || !e.target) return false
        if (e.target.busInfo && e.target.busInfo.equipmentBelong == 0) {
            e.target.isContained = 'out'
            return true
        }
        let areas = []
        vm.canvas.forEachObject(item => {
            if (item.oType == 'area' && item.busInfo.districtId == e.target.busInfo.districtId) {
                areas.push(item)
            }
        })
        let isContained = false
        if (areas.length) {

            areas.forEach(item => {
                if (e.target.isContainedWithinObject(item, false, true)) {
                    isContained = item.uuid
                }
            })
            e.target.isContained = isContained
            if (isContained) {
                e.target.opacity = 1
                e.target.item(0).set({
                    strokeWidth: 3,
                    stroke: 'transparent'
                })
            } else {
                e.target.opacity = 1
                e.target.item(0).set({
                    strokeWidth: 3,
                    stroke: '#ED4014'
                })
            }

        }
        if (isContained) return isContained
        const list = []
        for (let j = 0; j < vm.canvas._objects.length; j++) {
            if ((vm.canvas._objects[j].oType != 'wall' && vm.canvas._objects[j].oType != 'area') || vm.canvas._objects[j] == e.target) {
                continue
            }
            if (vm.canvas._objects[j].intersectsWithObject(e.target)) {
                if (list.indexOf(vm.canvas._objects[j]) < 0) {
                    list.push(vm.canvas._objects[j])
                }
            }
        }
        let isAttachedAll = list.length > 1 && list.every(item => {
            return item.busInfo.id == e.target.busInfo.districtId
        })
        if (isAttachedAll) {
            e.target.opacity = 1
            e.target.isContained = list[0].uuid
            e.target.item(0).set({
                strokeWidth: 3,
                stroke: 'transparent'
            })
        } else {
            e.target.opacity = 1
            e.target.item(0).set({
                strokeWidth: 3,
                stroke: '#ED4014'
            })
        }
        return isAttachedAll
    },
    checkObjOverflow(vm) { // 检测元素在画布外
        let canvas = vm.canvas
        let list = []
        canvas.forEachObject(obj => {
            let objBoundingBox = obj.getBoundingRect()
            if (objBoundingBox.top < 0) {
                obj.set('top', 0)
                obj.setCoords()
                if (list.indexOf(obj) < 0) list.push(obj)
            }
            if (objBoundingBox.left > canvas.width - objBoundingBox.width) {
                obj.set('left', canvas.width - objBoundingBox.width)
                obj.setCoords()
                if (list.indexOf(obj) < 0) list.push(obj)
            }
            if (objBoundingBox.top > canvas.height - objBoundingBox.height) {
                obj.set('top', canvas.height - objBoundingBox.height)
                obj.setCoords()
                if (list.indexOf(obj) < 0) list.push(obj)
            }
            if (objBoundingBox.left < 0) {
                obj.set('left', 0)
                obj.setCoords()
                if (list.indexOf(obj) < 0) list.push(obj)
            }
        })
        canvas.renderAll()
        return list
    },
    recordOld(e, vm) { // 记录老数据，用于自动回退，暂时不做这个功能了
        fUtils.checkOverlapping.call(vm.canvas, e, vm);
        if ((!this.isOverlapping && this.oType != 'device') || (this.isContained && this.oType == 'device')) {
            let obj = this
            this.old = this.toJSON();
            var w = Math.floor((obj.width * obj.scaleX) * multiple) / multiple,
                h = obj.oType == 'wall' ? (vm.wallThickness || wallHieght) : Math.floor((obj.height * obj.scaleY) * multiple) / multiple,
                a = Math.floor((obj.angle) * multiple) / multiple,
                x = Math.floor((obj.left) * posMultiple) / posMultiple,
                y = Math.floor((obj.top) * posMultiple) / posMultiple;
            a = a % 360;
            this.old.left = x
            this.old.top = y
            this.old.width = w;
            this.old.height = h;
            this.old.scaleX = 1;
            this.old.scaleY = 1;
        }
    },
    addWall(vm) { // 增加一面墙
        let fabric = window.fabric;
        let rectOption = {
            fill: '#aaa',
            width: 200,
            height: vm.wallThickness || wallHieght,
            strokeWidth: 0,
            // stroke: '#880E4F',
            // angle: 45,
            scaleX: 1,
            scaleY: 1,
            originX: 'center',
            originY: 'center',
            strokeUniform: false
        };

        // let textOption = {
        //   fontSize: 20,
        //   originX: 'center',
        //   originY: 'center'
        // };

        let textWidthOption = {
            fontSize: 12,
            originX: 'center',
            originY: 'center'
        };

        // let textHeightOption = {
        //   fontSize: 12,
        //   left: -100,
        //   originY: 'center'
        // };

        let textAngleOption = {
            fontSize: 12,
            left: -96,
            originY: 'center'
        };

        let groupOption = {
            left: 100,
            top: 100,
            strokeWidth: 0,
            cornerSize: 10,
            cornerStyle: 'circle',
            transparentCorners: false,
            borderOpacityWhenMoving: 1,
            opacity: defaultOpacity,
            oType: 'wall',
            strokeUniform: false
        };

        var rect = new fabric.Rect(rectOption);

        var textWidth = new fabric.Text('宽', textWidthOption);

        var textAngle = new fabric.Text('角度', textAngleOption);

        var group = new fabric.Group([rect, textWidth, textAngle], groupOption);

        fUtils.makeWallAlive(group, vm)
        group.old = undefined
        vm.canvas.add(group);
        vm.canvas.renderAll()
    },
    makeWallAlive(group, vm, upper) { // 激活墙
        if (!group.uuid) {
            group.uuid = fUtils.generateGuuId()
        }
        group.set({
            strokeWidth: 0,
            cornerSize: 10,
            cornerStyle: 'circle',
            transparentCorners: false,
            borderOpacityWhenMoving: 1,
            opacity: defaultOpacity,
            hasControls: false,
            hasBorders: false
        })
        // group.old = group.toJSON();
        group.setControlVisible('mt', false);
        group.setControlVisible('tr', false);
        group.setControlVisible('br', false);
        group.setControlVisible('mb', false);
        group.setControlVisible('bl', false);
        group.setControlVisible('tl', false);

        let wallThickness = vm.wallThickness || wallHieght;

        if (upper) {
            group.set({
                hoverCursor: 'move'
            })
        }

        group.on('added', function () {
            var obj = this,
                w = Math.floor((obj.width * obj.scaleX) * multiple) / multiple,
                h = wallThickness,
                a = Math.floor((obj.angle) * multiple) / multiple;
            this.set('height', wallThickness);
            this.item(1).set({
                text: '墙：' + w.toFixed(0)
            });
            this.item(2).set({
                text: a.toFixed(0) + '°'
            });
            group.on('rotating', function (e) {
                var a = Math.floor((this.angle) * multiple) / multiple;
                a = a % 360;
                // this.item(1).set({
                //   angle: -a
                // });
                this.item(2).set({
                    text: a.toFixed(0) + '°'
                });
                // fUtils.recordOld.call(this, e, vm);
                vm.now.nowAngle = a;
            });

            group.on('scaling', function (e) {
                var obj = this,
                    w = Math.floor((obj.width * obj.scaleX) * multiple) / multiple,
                    h = wallThickness;
                this.item(1).set({
                    scaleX: 1 / group.scaleX,
                    scaleY: 1 / group.scaleY,
                    text: '墙：' + w.toFixed(0)
                });
                this.item(2).set({
                    scaleX: 1 / group.scaleX,
                    scaleY: 1 / group.scaleY
                });
                // fUtils.recordOld.call(this, e, vm);
                vm.now.nowWidth = w;
                vm.now.nowHeight = h;
            });

            group.on('moving', function (e) {
                // fUtils.recordOld.call(this, e, vm);
            });
        });


        group.on('modified', function (e) {
            // if (this.old) this.setOptions(this.old);
            this.setCoords();
            fUtils.wallGroupModified(vm, this);
            // fUtils.checkOverlapping.call(vm.canvas, e, vm);
            vm.checkOver()
        });
    },
    wallGroupModified(vm, obj, nW, nA, nX, nY) { // 墙修改回调
        var w = Math.floor((nW || obj.width * obj.scaleX) * multiple) / multiple,
            h = vm.wallThickness || wallHieght,
            a = nA == 0 ? nA : Math.floor((nA || obj.angle) * multiple) / multiple,
            x = nX == 0 ? nX : Math.floor((nX || obj.left) * posMultiple) / posMultiple,
            y = nY == 0 ? nY : Math.floor((nY || obj.top) * posMultiple) / posMultiple;
        a = a % 360;
        obj.set({
            height: h,
            width: w,
            scaleX: 1,
            scaleY: 1,
            angle: a,
            left: x,
            top: y
        });
        obj.item(0).set({
            height: h,
            width: w
        });
        obj.item(1).set({
            scaleX: 1,
            scaleY: 1,
            text: '墙：' + w.toFixed(0)
        });
        obj.item(2).set({
            scaleX: 1,
            scaleY: 1,
            left: -(w / 2) + 4,
            text: a.toFixed(0) + '°'
        });
        vm.now.nowWidth = w;
        vm.now.nowHeight = h;
        vm.now.nowAngle = a;
        vm.now.nowX = x;
        vm.now.nowY = y;
    },
    addRect(vm, w, h, f, noScale, type, oImg, x, y, name, color, busInfo) { // 增加矩形
        let nameMap = {
            'area': '区域',
            'device': '设备'
        }
        let colorMap = {
            'area': 'yellow',
            'device': 'white'
        }
        let fabric = window.fabric
        var w = w || 200, h = h || 200, f = f || 20, type = type || 'area';
        let rectOption = {
            fill: color || colorMap[type],
            width: w,
            height: h,
            strokeWidth: 0,
            // stroke: '#880E4F',
            // angle: 45,
            originX: 'center',
            originY: 'center',
            strokeUniform: false
        };

        let textOption = {
            fontSize: f,
            originX: 'center',
            originY: 'center',
            textBackgroundColor: 'rgb(255,255,255,0.8)'
        };

        let textWidthOption = {
            fontSize: f - 4,
            top: -(h / 2) + 2,
            originX: 'center',
            textBackgroundColor: 'rgb(255,255,255,0.8)'
        };

        let textHeightOption = {
            fontSize: f - 4,
            left: -(w / 2) + 2,
            originY: 'center',
            textBackgroundColor: 'rgb(255,255,255,0.8)'
        };

        let textAngleOption = {
            fontSize: f - 4,
            left: -(w / 2) + 2,
            top: -(h / 2) + 2,
            textBackgroundColor: 'rgb(255,255,255,0.8)'
        };
        let groupOption = {
            left: x || 100,
            top: y || 100,
            strokeWidth: 0,
            cornerSize: 10,
            cornerStyle: 'circle',
            transparentCorners: false,
            borderOpacityWhenMoving: 1,
            opacity: defaultOpacity,
            oType: type,
            strokeUniform: false
        };

        var rect = new fabric.Rect(rectOption);
        if (type == 'device') {
            oImg.set(rectOption)
            oImg.set('crossOrigin', 'Anonymous')
            console.log(oImg)
            rect = oImg
            // groupOption.opacity = 0.5
        }

        var text = new fabric.Text(name || nameMap[type], textOption);

        var textWidth = new fabric.Text('0', textWidthOption);

        var textHeight = new fabric.Text('0', textHeightOption);

        var textAngle = new fabric.Text('0', textAngleOption);

        var group = new fabric.Group([rect, text, textWidth, textHeight, textAngle], groupOption);

        if (noScale) {
            group.setControlsVisibility({
                tl: false,
                tr: false,
                br: false,
                bl: false,
                ml: false,
                mt: false,
                mr: false,
                mb: false,
                mtr: true
            });
        }
        group.busInfo = busInfo || {}
        group.old = undefined
        fUtils[
            'make' +
            group.oType.replace(/^./, s => {
                return s.toUpperCase();
            }) +
            'Alive'
        ](group, vm);
        vm.canvas.add(group);
    },
    makeRectAlive(group, vm, upper) { // 激活矩形
        if (!group.uuid) {
            group.uuid = fUtils.generateGuuId()
        }
        group.set({
            strokeWidth: 0,
            cornerSize: 10,
            cornerStyle: 'circle',
            transparentCorners: false,
            borderOpacityWhenMoving: 1,
            opacity: defaultOpacity,
            hoverCursor: 'default',
            hasControls: false,
            hasBorders: false,
            borderColor: '#000',
            cornerColor: '#000',
            centeredRotation: true
        })
        if (group.oType == 'device') {
            group.setControlsVisibility({
                tl: false,
                tr: false,
                br: false,
                bl: false,
                ml: false,
                mt: false,
                mr: false,
                mb: false,
                mtr: true
            });
            group.isContained = fUtils.checkContain({ target: group }, vm)
            group._objects[1].set('fontSize', 12);
            group._objects[2].set('fontSize', 12);
            group._objects[3].set('fontSize', 12);
            group.set({
                opacity: 1,
                hoverCursor: 'pointer'
            })
        }
        if (group.oType == 'area') {
            group._objects[1].set('textBackgroundColor', 'transparent');
            group._objects[2].set('textBackgroundColor', 'transparent');
            group._objects[3].set('textBackgroundColor', 'transparent');
        }

        group._objects[4].set('fill', 'transparent');
        group._objects[4].set('textBackgroundColor', 'transparent');

        // group.old = group.toJSON();

        group.on('added', function () {
            var obj = this,
                w = obj.width * obj.scaleX,
                h = obj.height * obj.scaleY,
                a = obj.angle;
            this.item(2).set({
                text: w.toFixed(0)
            });
            this.item(3).set({
                text: h.toFixed(0)
            });
            this.item(4).set({
                text: a.toFixed(0) + '°'
            });
        });
        if (upper) {
            group.set({
                hoverCursor: 'move'
            })
        }
        // if (upper) {
        //     group.set({
        //         hoverCursor: 'move'
        //     })

        //     group.on('rotating', function (e) {
        //         var a = Math.floor((this.angle) * multiple) / multiple;
        //         a = a % 360;
        //         this.item(1).set({
        //             angle: -a
        //         });
        //         // this.item(4).set({
        //         //     text: a.toFixed(0) + '°'
        //         // });
        //         // fUtils.recordOld.call(this, e, vm);
        //         vm.now.nowAngle = a;
        //     });

        //     group.on('scaling', function (e) {
        //         var obj = this,
        //             w = Math.floor((obj.width * obj.scaleX) * multiple) / multiple,
        //             h = Math.floor((obj.height * obj.scaleY) * multiple) / multiple;
        //         this.item(1).set({
        //             scaleX: 1 / group.scaleX,
        //             scaleY: 1 / group.scaleY
        //         });
        //         this.item(2).set({
        //             scaleX: 1 / group.scaleX,
        //             scaleY: 1 / group.scaleY,
        //             text: w.toFixed(0)
        //         });
        //         this.item(3).set({
        //             scaleX: 1 / group.scaleX,
        //             scaleY: 1 / group.scaleY,
        //             text: h.toFixed(0)
        //         });
        //         this.item(4).set({
        //             scaleX: 1 / group.scaleX,
        //             scaleY: 1 / group.scaleY
        //         });
        //         // fUtils.recordOld.call(this, e, vm);
        //         vm.now.nowWidth = w;
        //         vm.now.nowHeight = h;
        //     });

        //     group.on('moved', function (e) {
        //         var x = Math.floor((this.left) * posMultiple) / posMultiple,
        //             y = Math.floor((this.top) * posMultiple) / posMultiple;
        //         vm.now.nowX = x
        //         vm.now.nowY = y
        //         // fUtils.recordOld.call(this, e, vm);
        //     });
        // }

        group.on('modified', function (e) {
            // if (this.old) this.setOptions(this.old);
            if (vm.bindPage) return
            this.setCoords();
            fUtils.rectGroupModified(vm, this);
            // fUtils.checkOverlapping.call(vm.canvas, e, vm);
            vm.checkOver()
        });
    },
    addDevice(vm, params, callback) { // 增加设备
        let fabric = window.fabric
        fabric.Image.fromURL(params.url || '/brain/images/logo.ffa7be2.jpg', function (oImg) {
            fUtils.addRect(vm, params.w / 10, params.h / 10, 12, true, 'device', oImg, params.x, params.y, params.name, params.color, params.busInfo)
            callback()
        }, { crossOrigin: 'anonymous', width: params.w / 10, height: params.h / 10 })
    },
    makeDeviceAlive(group, vm, upper) {
        fUtils.makeRectAlive(group, vm, upper)
    },
    makeAreaAlive(group, vm, upper) {
        fUtils.makeRectAlive(group, vm, upper)
    },
    rectGroupModified(vm, obj, nW, nH, nA, nX, nY) { // 修改矩形回调
        var w = Math.floor((nW || obj.width * obj.scaleX) * multiple) / multiple,
            h = Math.floor((nH || obj.height * obj.scaleY) * multiple) / multiple,
            a = nA == 0 ? nA : Math.floor((nA || obj.angle) * multiple) / multiple,
            x = nX == 0 ? nX : Math.floor((nX || obj.left) * posMultiple) / posMultiple,
            y = nY == 0 ? nY : Math.floor((nY || obj.top) * posMultiple) / posMultiple;
        a = a % 360;
        obj.set({
            height: h,
            width: w,
            scaleX: 1,
            scaleY: 1,
            angle: a,
            left: x,
            top: y
        });
        obj.item(0).set({
            height: h,
            width: w
        });
        obj.item(1).set({
            scaleX: 1,
            scaleY: 1,
            angle: -a
        });
        let initNum = 2
        while (!obj.item(1).isContainedWithinObject(obj.item(0)) && initNum < 2) {
            let text = obj.item(1).text.replace('\n', '')
            let str = ''
            const index = Math.floor(text.length / initNum)
            for (let i = 0; i < initNum; i++) {
                if (i == initNum - 1) {
                    str += text.slice(i * index) + '\n'
                } else {
                    str += text.slice(i * index, (i + 1) * index) + '\n'
                }
            }
            obj.item(1).set({
                text: str,
                textAlign: 'center'
            })
            initNum++
        }
        obj.item(2).set({
            scaleX: 1,
            scaleY: 1,
            top: -(h / 2) + 2,
            text: w.toFixed(0)
        });
        obj.item(3).set({
            scaleX: 1,
            scaleY: 1,
            left: -(w / 2) + 2,
            text: h.toFixed(0)
        });
        if (obj.oType != 'device') {
            obj.item(4).set({
                scaleX: 1,
                scaleY: 1,
                top: -(h / 2) + 2,
                left: -(w / 2) + 2,
                text: a.toFixed(0) + '°'
            });
        }
        vm.now.nowWidth = w;
        vm.now.nowHeight = h;
        vm.now.nowAngle = a;
        vm.now.nowX = x;
        vm.now.nowY = y;
    },
}