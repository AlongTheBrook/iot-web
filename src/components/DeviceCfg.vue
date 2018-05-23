<template>
<div :class="$style.module">
  <div :class="$style.title">
    <div>
      <div>创建或修改设备</div>
      <a class="button is-primary is-radiusless" :class="{'is-loading': isCommitting}" :disabled="isCommitting" @click="commit">创建设备</a>
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
            <input v-model="device.name" name="名称" ref="名称"
                   class="input is-small is-radiusless" :class="[$style.input, errors.has('名称') ? $style.error : null]" type="text" placeholder=""
                   v-validate="'required|max:64'">
            <div v-show="errors.has('名称')" :class="$style.error">{{ errors.first('名称') }}</div>
          </div>
        </div>
        <div>
          <div>描述</div>
          <div>
            <input  v-model="device.desc" name="描述" ref="描述"
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
        <div><div>注册包</div><div><input v-model="device.accessCode" class="input is-small is-radiusless" :class="$style.input" type="text" placeholder="<与入码相同>" readonly></div></div>
        <div><div>心跳包</div><div><input class="input is-small is-radiusless" :class="$style.input" type="text" placeholder="" value="H" readonly></div></div>
        <div>
          <div>心跳周期</div>
          <div>
            <div :class="$style.inputGroup">
              <input v-model="hbIntervalMinu" name="心跳周期" ref="心跳周期"
                     class="input is-small is-radiusless" :class="[$style.input, errors.has('心跳周期') ? $style.error : null]" type="number" min="1" placeholder=""
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
              <select class="is-radiusless" v-model="device.descriptorObj.isTcp">
                <option :value="false">MODBUS-RTU</option>
                <option :value="true">MODBUS-TCP</option>
              </select>
            </div>
          </div>
        </div>
        <div v-show="!device.descriptorObj.isTcp">
          <div>从站地址</div>
          <div>
            <input v-model="device.descriptorObj.slaveAddress" name="从站地址" ref="从站地址"
              class="input is-small is-radiusless" :class="[$style.input, errors.has('从站地址') ? $style.error : null]" type="text" placeholder=""
              v-validate="'required|numeric|min_value:1|max_value:255'">
            <div v-show="errors.has('从站地址')" :class="$style.error">{{ errors.first('从站地址') }}</div>
          </div>
        </div>
        <div>
          <div>数采间隔</div>
          <div>
            <div :class="$style.inputGroup">
              <input v-model="daIntervalMinu" name="数采间隔" ref="数采间隔"
                class="input is-small is-radiusless" :class="[$style.input, errors.has('数采间隔') ? $style.error : null]" type="number" min="1" placeholder=""
                v-validate="'required|numeric|min_value:1|max_value:60'">
              <div>分</div>
            </div>
            <div v-show="errors.has('数采间隔')" :class="$style.error">{{ errors.first('数采间隔') }}</div>
          </div>
        </div>
      </div>
    </div>
    <div :class="[$style.block, collapsedDataCfg ? $style.collapsed : null]">
      <div :class="$style.head" @click="collapsedDataCfg = !collapsedDataCfg">
        <div>数据配置</div>
        <div :class="$style.tag">数据配置</div>
      </div>
      <div :class="$style.body">内容</div>
    </div>
  </div>
</div>
</template>

<script>
// 初始化：创建：数据需要指定默认值；修改：初始化descriptorObj为descriptor。
// 提交：需要检查验证状态
let deviceDebug = JSON.parse('{"name":"接口测试#1","desc":"这里是描述#1","alarmDataIndex":2,"descriptorType":"modbus","descriptorObj":{"isTcp":false,"slaveAddress":1,"allDataCountUpper":64,"allDataByteCountUpper":256,"allFrameCountUpper":16,"frameByteCountUpper":128,"hbIntervalSec":60,"daIntervalSec":120},"datas":[{"name":"进口压力","valueType":"Short","readOnly":false,"descriptorType":"modbus","descriptorObj":{"dataModelCode":3,"startingAddress":0,"addressCount":1,"byteOrder":"BIG_ENDIAN","isBit":false,"bitIndex":-1,"charset":"UTF-8"}},{"name":"出口压力","valueType":"Short","readOnly":false,"descriptorType":"modbus","descriptorObj":{"dataModelCode":3,"startingAddress":1,"addressCount":1,"byteOrder":"BIG_ENDIAN","isBit":false,"bitIndex":-1,"charset":"GBK"}},{"name":"电流","valueType":"Short","readOnly":false,"descriptorType":"modbus","descriptorObj":{"dataModelCode":3,"startingAddress":2,"addressCount":1,"byteOrder":"BIG_ENDIAN","isBit":false,"bitIndex":-1,"charset":null}},{"name":"电流2","valueType":"Long","readOnly":false,"descriptorType":"modbus","descriptorObj":{"dataModelCode":3,"startingAddress":3,"addressCount":1,"byteOrder":"BIG_ENDIAN","isBit":false,"bitIndex":-1,"charset":null}}]}')

export default {
  name: 'device-cfg',
  data () {
    return {
      collapsedBasicMsg: false,
      collapsedConnectWay: false,
      collapsedDeviceType: false,
      collapsedDataCfg: false,
      device: deviceDebug,
      alertBeforeUnload: true,
      isCommitting: false,
      committingErr: ''
    }
  },
  computed: {
    hbIntervalMinu: {
      get () {
        return Number.parseInt(this.device.descriptorObj.hbIntervalSec / 60)
      },
      set (newValue) {
        this.device.descriptorObj.hbIntervalSec = Number.parseInt(newValue) * 60
      }
    },
    daIntervalMinu: {
      get () {
        return Number.parseInt(this.device.descriptorObj.daIntervalSec / 60)
      },
      set (newValue) {
        this.device.descriptorObj.daIntervalSec = Number.parseInt(newValue) * 60
      }
    },
    fieldNames () {
      return Object.keys(this.fields)
    }
  },
  mounted () {
    // 此方法在移动端的H5规范中不生效，经多次尝试解决，未找到方法
    window.onbeforeunload = () => {
      if (this.alertBeforeUnload) {
        return false
      }
    }
  },
  methods: {
    commit () {
      this.committingErr = ''
      this.isCommitting = true
      this.validate().then((flags) => {
        let i = 0
        for (const flag of flags) {
          if (!flag) {
            this.$refs[this.fieldNames[i]].focus()
            return
          }
          i++
        }
        // TODO 提交工作
      }).catch((err) => {
        this.committingErr = err.message
      }).finally(() => {
        this.isCommitting = false
      })
    },
    validate () {
      const promises = []
      for (const field of this.fieldNames) {
        promises.push(this.$validator.validate(field))
      }
      return Promise.all(promises)
    }
  }
}
</script>

<style lang="scss" module>
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

.error {
  color: red;
  font-size: 0.75rem;
}

.input {
  @include underline-form;
  padding: 0 0.25rem 0.1rem 0.25rem;
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
}

.module {
  width: 100%;
  & > * {
    background-color: white;
    margin-bottom: 0.5rem;
  }
  & > .title {
    width: 100%;
    padding: 0.5rem;
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
  }
  & > .content {
    & > .block {
      position: relative;
      padding: 0.5rem;
      $border-color: rgba(197, 197, 197, 0.44);
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
          padding-right: 1rem;
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
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        align-content: center;
        & > * {
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
