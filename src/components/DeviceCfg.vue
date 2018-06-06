<!--suppress HtmlFormInputWithoutLabel -->
<template>
<div :class="$style.module">
  <div :class="$style.title">
    <div>
      <div>{{ isModify ? '修改设备' : '创建设备' }}</div>
      <a class="button is-radiusless" :class="[isCommitting ? 'is-loading': null, isModify ? $style.isWarning : 'is-primary']" :disabled="isCommitting || inputOpCount <= 0" @click="commit">{{ isModify ? '修改设备' : '创建设备' }}</a>
    </div>
    <div :class="$style.error" v-if="committingErr">{{ committingErr }}</div>
  </div>
  <div :class="$style.content">
    <div :class="[$style.block, collapsedBasicMsg ? $style.collapsed : null]">
      <div :class="$style.head" @click="collapsedBasicMsg = !collapsedBasicMsg">
        <div>基本信息</div>
        <div :class="$style.tag">{{device.name}}</div>
      </div>
      <div :class="$style.body">
        <div>
          <div>名称</div>
          <div>
            <input v-model.trim="device.name" name="名称" ref="名称"
                   class="input is-small is-radiusless" :class="[$style.input, errors.has('名称') ? $style.error : null]" type="text" placeholder=""
                   v-validate="'required|max:64'">
            <div v-show="errors.has('名称')" :class="$style.error">{{ errors.first('名称') }}</div>
          </div>
        </div>
        <div>
          <div>描述</div>
          <div>
            <input  v-model.trim="device.desc" name="描述" ref="描述"
                    class="input is-small is-radiusless" :class="[$style.input, errors.has('描述') ? $style.error : null]" type="text" placeholder=""
                    v-validate="'max:64'">
            <div v-show="errors.has('描述')" :class="$style.error">{{ errors.first('描述') }}</div>
          </div>
        </div>
        <div><div>接入码</div><div><input v-model="device.accessCode" class="input is-small is-radiusless" :class="$style.input" type="text" placeholder="<创建后自动生成>" readonly></div></div>
      </div>
    </div>
    <div :class="[$style.block, collapsedConnectWay ? $style.collapsed : null]">
      <div :class="$style.head" @click="collapsedConnectWay = !collapsedConnectWay">
        <div>接入方式</div>
        <div :class="$style.tag">DTU</div>
      </div>
      <div :class="$style.body">
        <div>
          <div>接入方式</div>
          <div>
            <div class="select is-small " :class="$style.select">
              <select class="is-radiusless">
                <option selected>DTU</option>
              </select>
            </div>
          </div>
        </div>
        <div><div>注册包</div><div><input v-model="device.accessCode" class="input is-small is-radiusless" :class="$style.input" type="text" placeholder="<与接入码相同>" readonly></div></div>
        <div><div>心跳包</div><div><input class="input is-small is-radiusless" :class="$style.input" type="text" placeholder="" value="H" readonly></div></div>
        <div>
          <div>心跳周期</div>
          <div>
            <div :class="$style.inputGroup">
              <input v-model.number="hbIntervalMinu" name="心跳周期" ref="心跳周期"
                     class="input is-small is-radiusless" :class="[$style.input, errors.has('心跳周期') ? $style.error : null]" type="number" placeholder=""
                     v-validate="'required|numeric|min_value:1|max_value:60'">
              <div>分</div>
            </div>
            <div v-show="errors.has('心跳周期')" :class="$style.error">{{ errors.first('心跳周期') }}</div>
          </div>
        </div>
      </div>
    </div>
    <div :class="[$style.block, collapsedDeviceType ? $style.collapsed : null]">
      <div :class="$style.head" @click="collapsedDeviceType = !collapsedDeviceType">
        <div>设备类型</div>
        <div :class="$style.tag">{{ device.descriptorObj.isTcp ? 'MODBUS-TCP' : 'MODBUS-RTU'}}</div>
      </div>
      <div :class="$style.body">
        <div>
          <div>设备类型</div>
          <div>
            <div class="select is-small " :class="$style.select">
              <select class="is-radiusless" v-model="device.descriptorObj.isTcp" @change="onIsTcpChange">
                <option :value="false">MODBUS-RTU</option>
                <option :value="true">MODBUS-TCP</option>
              </select>
            </div>
          </div>
        </div>
        <div v-show="!device.descriptorObj.isTcp">
          <div>从站地址</div>
          <div>
            <input v-model.number="device.descriptorObj.slaveAddress" name="从站地址" ref="从站地址"
                   class="input is-small is-radiusless" :class="[$style.input, errors.has('从站地址') ? $style.error : null]" type="number" placeholder=""
                   v-validate="'required|numeric|min_value:1|max_value:255'">
            <div v-show="errors.has('从站地址')" :class="$style.error">{{ errors.first('从站地址') }}</div>
          </div>
        </div>
        <div>
          <div>数采间隔</div>
          <div>
            <div :class="$style.inputGroup">
              <input v-model.number="daIntervalMinu" name="数采间隔" ref="数采间隔"
                     class="input is-small is-radiusless" :class="[$style.input, errors.has('数采间隔') ? $style.error : null]" type="number" placeholder=""
                     v-validate="'required|numeric|min_value:1|max_value:60'">
              <div>分</div>
            </div>
            <div v-show="errors.has('数采间隔')" :class="$style.error">{{ errors.first('数采间隔') }}</div>
          </div>
        </div>
        <div>
          <div>
            最大帧长
            <span v-tooltip="{trigger: 'click', placement: 'bottom-start',
                  content: '设备能接受请求或者回复响应的帧的最大长度'
                  + '<br/>注意：设置设备支持的最大值有利于提高性能'
                  + '<br/>帧：通讯过程中单次请求或响应的数据'}">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-info"></use>
              </svg>
            </span>
          </div>
          <div>
            <div :class="$style.inputGroup">
              <input v-model.number="device.descriptorObj.frameByteCountUpper" name="最大帧长" ref="最大帧长"
                     class="input is-small is-radiusless" :class="[$style.input, errors.has('最大帧长') ? $style.error : null]" type="number" placeholder=""
                     v-validate="'required|numeric|min_value:32|max_value:128'">
              <div :class="$style.unit">字节</div>
            </div>
            <div v-show="errors.has('最大帧长')" :class="$style.error">{{ errors.first('最大帧长') }}</div>
          </div>
        </div>
      </div>
    </div>
    <div :class="[$style.block, collapsedDataCfg ? $style.collapsed : null]">
      <div :class="$style.head" @click="collapsedDataCfg = !collapsedDataCfg">
        <div>数据配置</div>
        <div :class="$style.tag">
          {{ this.device.datas.length }}
        </div>
      </div>
      <div :class="[$style.body, $style.data]">
        <div :class="$style.stat">
          <div>
            <span>数据</span>
            <span @click.stop
                  v-tooltip="{trigger: 'click', placement: 'bottom-start',
                  content: '设备数据的个数'
                  + '<br/>注意：减少数据个数有助于提升通讯性能'}">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-info"></use>
              </svg>
          </span><span>:</span>
            <span>{{ this.device.datas.length }}</span><span>/{{ device.descriptorObj.allDataCountUpper }}</span>
          </div>
          <div>
            <span>报警</span>
            <span @click.stop
                  v-tooltip="{trigger: 'click', placement: 'bottom-start',
                  content: '设备报警关联的数据的序号'
                  + '<br/>1 可以不关联（即不使用此功能），关联后亦可以取消'
                  + '<br/>2 只能关联整数类型的数据'
                  + '<br/>2 通过“报警编码”页的配置来解析出含义'
                  + '<br/>3 数据的值为0表示无报警'}">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-info"></use>
              </svg>
          </span><span>:</span>
            <span>{{ alarmDataIndex === -1 ? '无' : alarmDataIndex }}</span>
          </div>
          <div>
            <span>字节</span>
            <span @click.stop
                  v-tooltip="{trigger: 'click', placement: 'bottom-start',
                  content: '设备所有数据的字节长度之和'
                  + '<br/>注意：减少字节长度有助于提升通讯性能'}">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-info"></use>
              </svg>
          </span><span>:</span>
            <span tabindex="-1" ref="allDataByteCount"
                  :class="countBytesAndFrames.allDataByteCount > device.descriptorObj.allDataByteCountUpper ? $style.error : null">
              {{ countBytesAndFrames.allDataByteCount }}</span><span>/{{ device.descriptorObj.allDataByteCountUpper }}</span>
          </div>
          <div>
            <span>帧数</span>
            <span @click.stop
                  v-tooltip="{trigger: 'click', placement: 'bottom-start',
                  content: '设备所有数据更新一次所需要的请求帧数'
                  + '<br/>注意：帧数对通讯性能的影响尤为明显'
                  + '<br/>建议：尽可能使数据的地址连续以减少帧数'}">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-info"></use>
              </svg>
          </span><span>:</span>
            <span tabindex="-1" ref="allFrameCount"
              :class="countBytesAndFrames.allFrameCount > device.descriptorObj.allFrameCountUpper ? $style.error : null">
              {{ countBytesAndFrames.allFrameCount }}</span><span>/{{ device.descriptorObj.allFrameCountUpper }}</span>
          </div>
        </div>
        <draggable v-model="device.datas" :options="{handle: '.handle', ghostClass: $style.sortableGhost}"
                   :class="$style.dataList">
          <div v-for="(data, index) in device.datas" :key="data.id" :ref="dataRefName(data.id, '')"
               @touchstart="onDataTouchStart($event, data.id)"
               @touchmove="onDataTouchMove($event, data.id)"
               @touchend="onDataTouchEnd(data.id)">
            <div class="handle" :class="[$style.index, data.id === alarmDataId ? $style.active : null]"
                 @touchstart="data.touchData.isLock = true" @touchend="data.touchData.isLock = false">{{ index }}</div>
            <input v-model.trim="data.name" :name="dataRefName(data.id, 'name')" :ref="dataRefName(data.id, 'name')" v-validate="'max:64'"
                   class="is-radiusless" :class="[$style.name, errors.has(dataRefName(data.id, 'name')) ? $style.error : null]" type="text" placeholder="<数据名称>" />
            <select v-model="data.valueType" class="is-radiusless" :class="$style.valueType" @change="onValueTypeChange(data)">
              <option :value="'Boolean'">开关量</option>
              <option :value="'Short'" selected>短整数</option>
              <option :value="'UShort'">无符号短整数</option>
              <option :value="'Integer'">整数</option>
              <option :value="'UInteger'">无符号整数</option>
              <option :value="'Long'">长整数</option>
              <option :value="'Float'">浮点数</option>
              <option :value="'Double'">双精度浮点数</option>
              <option :value="'String'">字符串</option>
            </select>
            <select v-model="data.descriptorObj.charset" class="is-radiusless" :class="$style.charset" v-show="data.valueType === 'String'">
              <option :value="'US-ASCII'" selected>US-ASCII</option>
              <option :value="'GBK'">GBK</option>
              <option :value="'UTF-8'">UTF-8</option>
            </select>
            <div :class="$style.readOnly" tabindex="-1" @click="onReadOnlyClick($event, data)">{{ data.readOnly ? '只读' : '读写'}}</div>
            <select v-model="data.descriptorObj.dataModelCode" class="is-radiusless" :class="$style.dataModelCode">
              <option :value="1" :disabled="data.valueType !== 'Boolean'">线圈</option>
              <option :value="2" :disabled="!data.readOnly || data.valueType !== 'Boolean'">离散输入</option>
              <option :value="3" selected>保持寄存器</option>
              <option :value="4" :disabled="!data.readOnly">输入寄存器</option>
            </select>
            <div :class="$style.startingAddress">
              <div :class="$style.tag">地址</div>
              <input v-model.number="data.descriptorObj.startingAddress"
                     :name="dataRefName(data.id, 'startingAddress')" :ref="dataRefName(data.id, 'startingAddress')" v-validate="'required|numeric|min_value:0|max_value:65535'"
                     class="is-radiusless" :class="errors.has(dataRefName(data.id, 'startingAddress')) ? $style.error : null" type="number"/>
            </div>
            <div :class="[$style.addressCount, data.valueType !== 'String' ? $style.readOnly : null]">
              <div :class="$style.tag">地址个数</div>
              <input v-model.number="data.descriptorObj.addressCount"
                     :name="dataRefName(data.id, 'addressCount')" :ref="dataRefName(data.id, 'addressCount')" v-validate="'required|numeric|min_value:1|max_value:128'"
                     :readonly="data.valueType !== 'String'" class="is-radiusless" :class="errors.has(dataRefName(data.id, 'addressCount')) ? $style.error : null" type="number"/>
            </div>
            <div :class="$style.isBit" tabindex="-1" @click="onIsBitClick($event, data)"
                 v-show="data.valueType === 'Boolean' && data.descriptorObj.dataModelCode !== 1 && data.descriptorObj.dataModelCode !== 2">
              {{ data.descriptorObj.isBit ? '按位' : '不按位'}}
            </div>
            <select v-model.number="data.descriptorObj.bitIndex" class="is-radiusless" :class="$style.bitIndex"
                    v-show="data.descriptorObj.isBit
                  && data.valueType === 'Boolean' && data.descriptorObj.dataModelCode !== 1 && data.descriptorObj.dataModelCode !== 2">
              <option v-for="index in 16" :key="index - 1" :value="index - 1">{{ index - 1 }}</option>
            </select>
            <div :class="$style.tail">
              <div :class="$style.delete" v-if="userAgent.isDesktopOrTv" @click="deleteData(index)">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-delete"></use>
                </svg>
              </div>
              <div :class="[$style.alarm, data.id === alarmDataId ? $style.selected : null]"
                   @click="onAlarmClick(data.id, data.valueType)">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-alarm"></use>
                </svg>
              </div>
              <div :class="$style.add" @click="addData(index)">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-add"></use>
                </svg>
              </div>
            </div>
            <div :class="$style.delete" tabindex="-1" :ref="dataRefName(data.id, 'delete')"
                 @blur="onDataTouchBlur(data.id)" @click="deleteData(index)">删除</div>
          </div>
        </draggable>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Draggable from 'vuedraggable'

// 获取框架外的初始数据
const _deviceLoaded = window._initData
/*
初始化常量
 */
const _dataTplDescriptorObj = () => {
  return {
    dataModelCode: 3,
    startingAddress: 0,
    addressCount: 1,
    byteOrder: 'BIG_ENDIAN',
    isBit: false,
    bitIndex: 0,
    charset: 'US-ASCII'
  }
}
const _dataTplTouchData = () => {
  return {
    start: -1,
    end: -1,
    isExpand: false,
    isLock: false,
    startY: -1,
    endY: -1,
    isVertical: undefined
  }
}
const _dataTpl = () => {
  return {
    id: null,
    name: '',
    valueType: 'Short',
    readOnly: false,
    descriptorType: 'modbus',
    descriptorObj: _dataTplDescriptorObj(),
    touchData: _dataTplTouchData()
  }
}
const _deviceTplDescriptorObj = () => {
  return {
    isTcp: false,
    slaveAddress: 1,
    allDataCountUpper: 64,
    allDataByteCountUpper: 256,
    allFrameCountUpper: 16,
    frameByteCountUpper: 128,
    hbIntervalSec: 60 * 2,
    daIntervalSec: 60 * 5
  }
}
const _deviceTplDatas = () => {
  return [_dataTpl()]
}
const _deviceTpl = () => {
  return {
    id: null,
    name: '',
    desc: '',
    alarmDataIndex: -1,
    descriptorType: 'modbus',
    descriptorObj: _deviceTplDescriptorObj(),
    datas: _deviceTplDatas()
  }
}

/*
初始化设备
 */
if (_deviceLoaded && _deviceLoaded.datas) {
  if (_deviceLoaded) {
    _deviceLoaded.descriptorObj = _deviceLoaded.descriptor
    _deviceLoaded.descriptor = undefined
    _deviceLoaded.descriptorJson = undefined
  }
  if (_deviceLoaded.datas) {
    let i = 0
    for (const data of _deviceLoaded.datas) {
      data.descriptorObj = data.descriptor
      data.descriptor = undefined
      _deviceLoaded.datas[i] = Object.assign({}, _dataTpl(), data)
      _deviceLoaded.datas[i].descriptorObj = Object.assign({}, _dataTplDescriptorObj(), data.descriptorObj)
      i++
    }
  }
}
const _device = Object.assign({}, _deviceTpl(), _deviceLoaded)
_device.descriptorObj = Object.assign({}, _deviceTplDescriptorObj(), _device.descriptorObj)

let _nextDataId = -1
if (_device.datas) {
  for (const data of _device.datas) {
    if (!data.id) {
      data.id = _nextDataId--
    }
  }
}

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'device-cfg',
  components: { Draggable },
  props: {
    userAgent: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      collapsedBasicMsg: !this.userAgent.isDesktopOrTv,
      collapsedConnectWay: !this.userAgent.isDesktopOrTv,
      collapsedDeviceType: !this.userAgent.isDesktopOrTv,
      collapsedDataCfg: !this.userAgent.isDesktopOrTv,
      device: _device,
      alertBeforeUnload: true,
      isCommitting: false,
      committingErr: '',
      nextDataIdValue: _nextDataId,
      alarmDataId: 0,
      axiosInst: null,
      inputOpCount: 0
    }
  },
  computed: {
    hbIntervalMinu: {
      get () {
        return Math.round(Number(this.device.descriptorObj.hbIntervalSec / 60))
      },
      set (newValue) {
        this.device.descriptorObj.hbIntervalSec = Number.parseInt(newValue) * 60
      }
    },
    daIntervalMinu: {
      get () {
        return Math.round(Number(this.device.descriptorObj.daIntervalSec / 60))
      },
      set (newValue) {
        this.device.descriptorObj.daIntervalSec = Number.parseInt(newValue) * 60
      }
    },
    fieldNames () {
      return Object.keys(this.fields)
    },
    isModify () {
      return Boolean(this.device.id)
    },
    alarmDataIndex () {
      return this.device.datas.findIndex(value => value.id === this.alarmDataId)
    },
    countBytesAndFrames () {
      /*
       * 数据结构化
       */
      const set = [new Set(), new Set(), new Set(), new Set()]
      for (const data of this.device.datas) {
        if (Number.isInteger(data.descriptorObj.startingAddress) && Number.isInteger(data.descriptorObj.addressCount)) {
          for (let i = 0; i < data.descriptorObj.addressCount; i++) {
            set[data.descriptorObj.dataModelCode - 1].add(data.descriptorObj.startingAddress + i)
          }
        }
      }
      /*
       * 计算所有数据字节数
       */
      let allDataByteCount = 0
      allDataByteCount += Math.floor((set[0].size / 8)) + (set[0].size % 8 === 0 ? 0 : 1)
      allDataByteCount += Math.floor((set[1].size / 8)) + (set[1].size % 8 === 0 ? 0 : 1)
      allDataByteCount += set[2].size * 2
      allDataByteCount += set[3].size * 2
      /*
       * 计算帧数
       */
      let allFrameCount = 0
      const frameDataByteCount = this.device.descriptorObj.frameByteCountUpper - (this.device.descriptorObj.isTcp ? 7 : 3) - 2
      const arr = [[...set[0]].sort(this.compareNumber), [...set[1]].sort(this.compareNumber), [...set[2]].sort(this.compareNumber), [...set[3]].sort(this.compareNumber)]
      // 数据模型1和2
      let frameAddressCount = frameDataByteCount * 8
      allFrameCount += this.countFrame(frameAddressCount, arr[0])
      allFrameCount += this.countFrame(frameAddressCount, arr[1])
      // 数据模型3和4
      frameAddressCount = Math.floor(frameDataByteCount / 2)
      allFrameCount += this.countFrame(frameAddressCount, arr[2])
      allFrameCount += this.countFrame(frameAddressCount, arr[3])
      /*
       * 返回结果
       */
      return {
        allDataByteCount,
        allFrameCount
      }
    }
  },
  watch: {
    alarmDataIndex () {
      this.device.alarmDataIndex = this.alarmDataIndex
    },
    device: {
      handler: function () {
        this.inputOpCount++
      },
      deep: true
    }
  },
  mounted () {
    // 此方法在移动端的H5规范中不生效，经多次尝试解决，未找到方法
    window.onbeforeunload = () => {
      if (this.alertBeforeUnload) {
        return false
      }
    }
    if (this.device.datas) {
      // 检查纠正数据
      for (const data of this.device.datas) {
        this.dataCheckAndCorrect(data)
      }
      // 初始化报警数据ID
      if (this.device.alarmDataIndex >= 0 && this.device.alarmDataIndex < this.device.datas.length) {
        this.alarmDataId = this.device.datas[this.device.alarmDataIndex].id
      }
    }
    // 获取CSRF的防范请求头
    const csrfHeaderElement = document.querySelector('meta[name="_csrf_header"]')
    const csrfElement = document.querySelector('meta[name="_csrf"]')
    const csrfHeader = csrfHeaderElement ? csrfHeaderElement.getAttribute('content') : 'DEBUG'
    const csrf = csrfElement ? csrfElement.getAttribute('content') : 'DEBUG'
    // 创建并初始化axios的实例
    this.axiosInst = this.$axios.create({
      headers: {[csrfHeader]: csrf}
    })
    // 设置操作计数清零
    this.$nextTick().then(() => {
      this.inputOpCount = 0
    })
  },
  methods: {
    compareNumber (num1, num2) {
      return num1 > num2 ? 1 : (num1 < num2 ? -1 : 0)
    },
    countFrame (frameAddressCount, addressArr) {
      let frameCount = 0
      let addressCount = 0
      let preAddress = -2
      for (const address of addressArr) {
        if (addressCount !== 0 && address !== preAddress + 1) {
          frameCount++
          addressCount = 1
          preAddress = address
          continue
        }
        addressCount++
        preAddress = address
        if (addressCount === frameAddressCount) {
          frameCount++
          addressCount = 0
        }
      }
      if (addressCount !== 0) {
        frameCount++
        addressCount = 0
      }
      return frameCount
    },
    commit () {
      const errPrefix = this.isModify ? '修改设备失败：' : '创建设备失败：'
      this.committingErr = ''
      this.isCommitting = true
      this.validate().then((flags) => {
        // 处理所有input的验证结果
        let i = 0
        for (const flag of flags) {
          if (!flag) {
            this.collapsedBasicMsg = false
            this.collapsedConnectWay = false
            this.collapsedDeviceType = false
            this.collapsedDataCfg = false
            const targetOrig = this.$refs[this.fieldNames[i]]
            const target = Array.isArray(targetOrig) ? targetOrig[0] : targetOrig
            this.$nextTick().then(() => {
              this.focus(target)
            })
            return
          }
          i++
        }
        // 验证所有数据字节数
        if (this.countBytesAndFrames.allDataByteCount > this.device.descriptorObj.allDataByteCountUpper) {
          this.collapsedDataCfg = false
          this.$nextTick().then(() => {
            this.focus(this.$refs.allDataByteCount)
          })
          return
        }
        // 验证请求帧数
        if (this.countBytesAndFrames.allFrameCount > this.device.descriptorObj.allFrameCountUpper) {
          this.collapsedDataCfg = false
          this.$nextTick().then(() => {
            this.focus(this.$refs.allFrameCount)
          })
          // return
        }
      }).catch((err) => {
        this.committingErr = errPrefix + err.message
      }).finally(() => {
        if (this.isCommitting) {
          this.isCommitting = false
          return
        }
        /// Start... 提交数据
        const url = this.isModify ? '/api/device/modify' : '/api/device/create'
        const datas = new Array(this.device.datas.length)
        for (let i = 0; i < datas.length; i++) {
          datas[i] = Object.assign({}, this.device.datas[i], {touchData: undefined})
        }
        const device = Object.assign({}, this.device, {datas})
        this.axiosInst.post(url, device).then((response) => {
          const result = response.data
          if (result.success) {
            const deviceId = result.data
            this.alertBeforeUnload = false
            this.$nextTick().then(() => {
              location.href = '/monitor/' + deviceId
            })
          } else {
            this.committingErr = errPrefix + result.desc
          }
        }).catch((err) => {
          this.committingErr = errPrefix + err.message
        }).finally(() => {
          this.isCommitting = false
        })
        /// End.
      })
    },
    focus (target) {
      target.focus()
      if (this.userAgent.isIOS) { // IOS下，focus事件必须由用户输入发起；或者调用代码处于用户输入发起的调用栈中：否则不生效
        // noinspection JSUnresolvedFunction
        target.scrollIntoViewIfNeeded()
      }
    },
    validate () {
      const promises = []
      for (const field of this.fieldNames) {
        promises.push(this.$validator.validate(field))
      }
      return Promise.all(promises)
    },
    nextDataId () {
      return this.nextDataIdValue--
    },
    onIsTcpChange () {
      if (this.device.descriptorObj.isTcp) {
        this.device.descriptorObj.slaveAddress = 1
      }
    },
    dataRefName (id, name) {
      return 'data_' + id + '_' + name
    },
    addressCount (valueType) {
      switch (valueType) {
        case 'Integer':
        case 'UInteger':
        case 'Float':
          return 2
        case 'Long':
        case 'Double':
          return 4
        case 'String':
          return undefined
        default:
          return 1
      }
    },
    dataCheckAndCorrect: function (data) {
      // 检查和更正数据模型
      if (data.valueType === 'Boolean') {
        if (data.readOnly) {
          // 不更改
        } else {
          if (data.descriptorObj.dataModelCode === 2) data.descriptorObj.dataModelCode = 1
          if (data.descriptorObj.dataModelCode === 4) data.descriptorObj.dataModelCode = 3
        }
      } else {
        if (data.readOnly) {
          if (data.descriptorObj.dataModelCode === 1 || data.descriptorObj.dataModelCode === 2) data.descriptorObj.dataModelCode = 3
        } else {
          data.descriptorObj.dataModelCode = 3
        }
      }
      // 检查和更新报警点
      if (this.isAlarmData(data.id) && !this.alarmDataValueTypeCheck(data.valueType)) {
        this.alarmDataId = 0
      }
      // 检查和更正字符集
      if (data.valueType === 'String') {
        if (!data.descriptorObj.charset) data.descriptorObj.charset = 'US-ASCII'
      } else {
        // noinspection JSValidateTypes
        data.descriptorObj.charset = null
      }
      if (!(data.descriptorObj.isBit && data.valueType === 'Boolean' &&
          data.descriptorObj.dataModelCode !== 1 && data.descriptorObj.dataModelCode !== 2)) {
        data.descriptorObj.bitIndex = -1
      } else if (data.descriptorObj.bitIndex < 0 || data.descriptorObj.bitIndex > 15) {
        data.descriptorObj.bitIndex = 0
      }
      // 检查和提示个数
      this.$nextTick().then(() => {
        this.$validator.validate(this.dataRefName(data.id, 'addressCount'))
      })
    },
    onValueTypeChange (data) {
      data.descriptorObj.addressCount = this.addressCount(data.valueType)
      this.dataCheckAndCorrect(data)
    },
    onReadOnlyClick (event, data) {
      event.target.focus()
      data.readOnly = !data.readOnly
      this.dataCheckAndCorrect(data)
    },
    onIsBitClick (event, data) {
      event.target.focus()
      data.descriptorObj.isBit = !data.descriptorObj.isBit
      this.dataCheckAndCorrect(data)
    },
    deleteData (dataIndex) {
      if (this.device.datas.length <= 1) {
        return
      }
      this.device.datas.splice(dataIndex, 1)
    },
    addData (dataIndex) {
      if (this.device.datas.length >= this.device.descriptorObj.allDataCountUpper) {
        return
      }
      this.device.datas.splice(dataIndex + 1, 0, this.newData(this.device.datas[dataIndex]))
    },
    newData (tplData) {
      let data
      if (tplData) {
        data = JSON.parse(JSON.stringify(tplData))
        if (data.descriptorObj.isBit) {
          if (data.descriptorObj.bitIndex === 15) {
            data.descriptorObj.bitIndex = 0
            data.descriptorObj.startingAddress += 1
          } else {
            data.descriptorObj.bitIndex += 1
          }
        } else {
          data.descriptorObj.startingAddress += data.descriptorObj.addressCount
        }
        if (data.name) {
          const reg = new RegExp(/\d+$/)
          if (reg.test(data.name)) {
            const numStr = reg.exec(data.name)[0]
            const numAdd = Number(numStr) + 1
            const numAddStr = this.prefixInteger(numAdd, Math.max(numStr.length, String(numAdd).length))
            data.name = data.name.replace(reg, numAddStr)
          } else {
            data.name = ''
          }
        }
      } else {
        data = _dataTpl()
      }
      data.id = this.nextDataId()
      return data
    },
    prefixInteger (num, len) {
      return (Array(len).join('0') + num).slice(-len)
    },
    onAlarmClick (dataId, dataValueType) {
      if (this.isAlarmData(dataId)) {
        this.alarmDataId = 0
        return
      }
      if (!this.alarmDataValueTypeCheck(dataValueType)) {
        return
      }
      this.alarmDataId = dataId
    },
    isAlarmData (dataId) {
      return this.alarmDataId === dataId
    },
    alarmDataValueTypeCheck (dataValueType) {
      switch (dataValueType) {
        case 'Short':
        case 'UShort':
        case 'Integer':
        case 'UInteger':
        case 'Long':
          return true
        default:
          return false
      }
    },
    touchData (dataId) {
      const data = this.device.datas.find(data => data.id === dataId)
      if (data) {
        return data.touchData
      }
      return undefined
    },
    dataTouchMoveValue (touchData) {
      if (touchData.start === -1) {
        return 0
      }
      const move = touchData.end - touchData.start
      if (touchData.isExpand) {
        if (move <= 0) {
          return -64
        }
        if (move > 64) {
          return 0
        }
        return move - 64
      } else {
        if (move >= 0) {
          return 0
        }
        if (move < -64) {
          return -64
        }
        return move
      }
    },
    dataTouchMove (dataId, moveValue) {
      const transform = moveValue ? `translateX(${moveValue}px)` : ''
      const children = this.$refs[this.dataRefName(dataId, '')][0].children
      for (const child of children) {
        child.style.transform = transform
      }
    },
    dataTouchTransition (dataId, flag) {
      const transition = flag ? 'transform .5s' : ''
      const children = this.$refs[this.dataRefName(dataId, '')][0].children
      for (const child of children) {
        child.style.transition = transition
      }
    },
    onDataTouchStart (event, dataId) {
      const touchData = this.touchData(dataId)
      if (touchData.isLock) {
        return
      }
      this.dataTouchTransition(dataId, false)
      touchData.start = event.touches[0].clientX
      touchData.end = touchData.start
      touchData.startY = event.touches[0].clientY
      touchData.endY = touchData.startY
    },
    onDataTouchMove (event, dataId) {
      const touchData = this.touchData(dataId)
      if (touchData.isVertical) {
        return
      }
      if (touchData.isVertical === false) {
        event.preventDefault()
      }
      if (touchData.start === -1) {
        return
      }
      touchData.end = event.touches[0].clientX
      touchData.endY = event.touches[0].clientY
      const moveValue = this.dataTouchMoveValue(touchData)
      if (moveValue) {
        if (touchData.isVertical === undefined) {
          const moveValueY = touchData.endY - touchData.startY
          // noinspection JSSuspiciousNameCombination
          if (Math.abs(moveValueY) > Math.abs(moveValue)) {
            touchData.isVertical = true
            return
          } else {
            touchData.isVertical = false
          }
        }
        this.dataTouchMove(dataId, moveValue)
      }
    },
    onDataTouchEnd (dataId) {
      const touchData = this.touchData(dataId)
      if (touchData.start === -1) {
        this.clearTouchData(touchData)
        return
      }
      this.dataTouchTransition(dataId, true)
      if (this.dataTouchMoveValue(touchData) <= -32) {
        this.dataTouchMove(dataId, -64)
        this.$refs[this.dataRefName(dataId, 'delete')][0].focus()
        touchData.isExpand = true
      } else {
        this.dataTouchMove(dataId, 0)
        this.$refs[this.dataRefName(dataId, 'delete')][0].blur()
        touchData.isExpand = false
      }
      this.clearTouchData(touchData)
    },
    onDataTouchBlur (dataId) {
      this.dataTouchMove(dataId, 0)
      const touchData = this.touchData(dataId)
      if (!touchData) {
        return
      }
      touchData.isExpand = false
      this.clearTouchData(touchData)
    },
    clearTouchData (touchData) {
      touchData.start = -1
      touchData.end = -1
      touchData.startY = -1
      touchData.endY = -1
      touchData.isLock = false
      touchData.isVertical = undefined
    }
  }
}
</script>

<style lang="scss" module>
@import "~bulma/sass/utilities/functions.sass";
@import "~bulma/sass/utilities/initial-variables.sass";

@mixin text-sle{
  min-width: 0;  // 适配flex-box布局：解决因为不能设置宽度而造成的无效
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@mixin underline-form {
  height: 1.5rem;
  font-size: 1rem!important;
  border-top: none;
  border-right: none;
  border-left: none;
  box-shadow: none;
  &:focus, &:active {
    box-shadow: 0 0.125rem 0 0 rgba(50, 115, 220, 0.25);
  }
  &.error {
    color: unset;
    border-color: red;
    &:focus, &:active {
      box-shadow: 0 0.125rem 0 0 rgba(255, 0, 0, 0.25);
    }
  }
}

input, select {
  //noinspection CssUnknownProperty
  appearance: none;
  &[type=number] {
    -moz-appearance:textfield;
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
}

.error {
  color: red;
  font-size: 0.75rem;
}

.is-warning {
  $color: darken($yellow, 18%);
  background-color: $color !important;
  border-color: transparent !important;
  color: white !important;
  &:hover {
    background-color: darken($color, 2.5%) !important;
    border-color: transparent !important;
    color: white !important;
  }
  &:active {
    background-color: darken($color, 5%) !important;
    border-color: transparent !important;
    color: white !important;
  }
}

.input {
  @include underline-form;
  &[readonly] {
    color: gray;
  }
}

.select {
  display: flex;
  align-items: flex-start;
  & > select {
    flex: auto;
    @include underline-form;
    padding: 0 0.25rem;
    &[readonly] {
      color: gray;
    }
  }
}

.inputGroup {
  display: flex;
  & > input {
    min-width: 0; // Hack for firefox only
  }
  & > .unit {
    flex: none;
  }
}

.sortable-ghost {
  opacity: 0;
}

.module {
  width: 100%;
  & > * {
    background-color: white;
  }
  $border-color: rgba(197, 197, 197, 0.44);
  & > .title {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    & > :first-child {
      display: flex;
      align-items: center;
      font-size: 1.25rem;
      justify-content: space-between;
    }
    & > .error {
      text-align: right;
      margin-top: 0.4rem;
    }
    box-shadow: 0 0 2px $border-color;
  }
  & > .content {
    & > .block {
      background-color: white;
      position: relative;
      padding: 0.5rem;
      &:first-child::before {
        content: '';
        display: block;
        position: absolute;
        right: 0;
        top: 0;
        width: 100%;
        border-bottom: 1px solid $border-color;
      }
      &::after {
        content: '';
        display: block;
        position: absolute;
        right: 0;
        bottom: 0;
        width: calc(100% - 0.5rem);
        border-bottom: 1px solid $border-color;
      }
      &:last-child::after {
        width: 100%;
      }
      $ec-btn-size: 0.5rem;
      & > .head {
        display: flex;
        align-items: center;
        align-content: center;
        cursor: pointer;
        font-weight: bold;
        & > :first-child {
          flex: none;
          padding-right: 1rem;
        }
        & > .tag {
          @include text-sle;
          flex: auto;
          padding-right: 1.25rem;
          font-weight: normal;
          font-size: 0.85rem;
          color: gray;
          text-align: right;
        }
        &::after {
          flex: none;
          content: '';
          width: $ec-btn-size;
          height: $ec-btn-size;
          $border-color: gray;
          border-top: 1px solid $border-color;
          border-right: 1px solid $border-color;
          transform: translate3d(-$ec-btn-size / 2, 0, 0) rotate(-45deg);
        }
      }
      & > .body {
        padding: 0.3125rem 0;
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        align-content: stretch;
        &:not(.data) > * {
          flex: 1 1 256px;
          display: flex;
          align-items: flex-start;
          padding: 0.5rem;
          & > :first-child {
            flex: none;
            font-weight: bold;
            color: #606060;
          }
          & > * {
            flex: auto;
            padding-right: 0.5rem;
          }
        }
        &.data {
          display: block;
          & > .stat {
            margin: 0.25rem;
            padding-top: 0;
            padding-bottom: 0;
            color: #606060;
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            align-content: flex-start;
            & > * {
              flex: none;
              padding-right: 1.5rem;
            }
            .error {
              font-size: 1rem;
              &:focus {
                outline: none;
              }
            }
          }
          & > .data-list {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: stretch;
            $dataHeight: 1.75rem;
            & > * {
              flex: auto;
              display: flex;
              justify-content: flex-start;
              flex-wrap: wrap;
              align-items: center;
              padding: 0;
              margin: 0.25rem;
              background-color: rgba(224, 224, 224, 0.26);
              position: relative;
              overflow: hidden;
              & > * {
                flex: none;
                padding: 0 0.75rem;
                height: $dataHeight;
                line-height: $dataHeight;
                border-left: 1px solid rgba(192, 192, 192, 0.25) !important;
                &:first-child {
                  flex: none;
                  font-weight: unset;
                }
                &:nth-child(1), &:nth-child(2), &:last-child {
                  border-left: unset !important;
                }
              }
              .error {
                background-color: rgba(255, 0, 0, 0.35);
                &:focus {
                  background-color: rgba(255, 0, 0, 0.5);
                }
              }
              $op-bk-color: rgba(224, 224, 224, 0.38);
              @mixin o-form-minxin {
                font-size: 1rem;
                font-family: inherit;
                color: inherit;
                border: none;
                background-color: unset;
                &:focus {
                  outline: unset;
                  background-color: $op-bk-color;
                }
              }
              input, select {
                @include o-form-minxin;
              }
              $alarm-color: darken($yellow, 24%);
              & > .index {
                width: $dataHeight;
                background-color: rgba(159, 159, 159, 0.75);
                color: white;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: move;
                user-select: none;
                &.active {
                  background-color: $alarm-color;
                }
              }
              & > .name {
                width: 10rem;
              }
              & > .value-type {
              }
              & > .charset {
                border-left: unset !important;
              }
              @mixin text-btn-mixin {
                cursor: default;
                user-select: none;
                &:active, &:focus {
                  background-color: $op-bk-color;
                  outline: none;
                }
              }
              & > .read-only {
                @include text-btn-mixin;
              }
              & > .data-model-code {
              }
              @mixin label-input-mixin($charCount) {
                position: relative;
                padding: 0;
                & > .tag {
                  position: absolute;
                  left: 0.75rem;
                  line-height: $dataHeight;
                  pointer-events: none;
                }
                & > input {
                  height: 100%;
                  width: 100%;
                  padding: 0 0.75rem 0 calc(#{1.25 * $charCount}rem + 0.75rem);
                }
              }
              & > .starting-address {
                @include label-input-mixin(2);
                width: 8rem;
              }
              & > .address-count {
                @include label-input-mixin(4);
                width: 9.5rem;
                border-left: unset !important;
                &.read-only {
                  color: gray;
                }
              }
              & > .is-bit {
                @include text-btn-mixin;
              }
              & > .bit-index {
                border-left: unset !important;
              }
              & > .tail {
                flex: auto;
                display: flex;
                height: $dataHeight;
                padding-right: 0;
                justify-content: flex-end;
                align-items: stretch;
                & > * {
                  flex: none;
                  width: $dataHeight * 1.5;
                  font-size: 1.25rem;
                }
                @mixin btn-mixin($hover-color, $active-color) {
                  text-align: center;
                  cursor: pointer;
                  user-select: none;
                  background-color: unset;
                  &:hover {
                    background-color: $hover-color;
                    color: findColorInvert($hover-color);
                  }
                  &.selected, &:active, &:focus {
                    background-color: $active-color;
                    color: findColorInvert($active-color);
                  }
                }
                & > .delete {
                  @include btn-mixin($orange, darken($orange, 5%));
                }
                & > .alarm {
                  @include btn-mixin(rgba(224, 224, 224, 0.38), $alarm-color);
                }
                & > .add {
                  @include btn-mixin($turquoise, darken($turquoise, 5%));
                }
              }
              & > .delete {
                $width: 64px;
                position: absolute;
                top: 0;
                right: -$width;
                width: $width;
                height: 100%;
                background-color: $orange;
                color: white;
                display: flex;
                justify-content: center;
                align-items: center;
                user-select: none;
              }
            }
          }
        }
      }
      &.collapsed {
        & > .head::after {
          transform: translate3d(-$ec-btn-size / 2, -$ec-btn-size / 4, 0) rotate(135deg);
        }
        & > .body {
          display: none;
        }
      }
    }
  }
}
</style>
