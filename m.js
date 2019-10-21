import React, { Component } from 'react'
import { CascaderSelect, Form } from '@alife/next'

import { request } from "../../utils/index"
import { customAlert } from './PublicWarning'

const deepnessLength = 3
const FormItem = Form.Item

export default class RipenessSelect extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [
      ],
      parentCode: 0,
      selectedValues: []
    }
  }

  async componentDidMount() {
    const _that = this
    let { fetchAllData, field } = this.props
    if (fetchAllData) {
      fetchAllData = String(fetchAllData)
      !async function reFetch(fetchIndex) {
        if (fetchIndex == fetchAllData.length) {
          return field.setValue('ripeness', fetchAllData)
        }
        
        let parentCode
        if (fetchIndex == 0) {
          parentCode = 0
          const dataSource = await _that.fetchData(parentCode)
          _that.setState({
            dataSource: transform(dataSource),
          }, () => {
            reFetch(++ fetchIndex)
          })
        } else {
          parentCode = fetchAllData.slice(0, fetchIndex)
          const pos = `0-${parentCode.split('').map(item => item - 1).join('-')}`
          _that.onSelect({
            pos,
            value: parentCode
          }, () => {
            reFetch(++ fetchIndex)
          })
        }
      }(0)
    } else {
      const dataSource = await this.fetchData(0)
      this.setState({
        dataSource: transform(dataSource),
      })
    }
  }

  fetchData = parentCode => {
    return new Promise(resolve => {
      request(
        'mtop.alihealth.trace.crm.enterprise.listcrmdict',
        {
          codeType: 'ripeness',
          parentCode,
        },
        response => {
          if (response.code != 200) {
            return customAlert(response.errMessage)
          }
          resolve(response.result)
        }
      )
    })
  }

  onSelect = ({ pos, value }, callback = () => {}) => {
    console.log('pos', pos)
    console.log('value', value)
    return new Promise(async (resolve) => {
      const { dataSource } = this.state

      const structure = pos.slice(2).split('-')

      const response = await this.fetchData(value)

      !function recursion(i, data) {
        if (!structure[i]) return (data.children = transform(response, i))
        return recursion(i + 1, data[structure[i]].children || data[structure[i]])
      }(0, dataSource)

      this.setState(
        {},
        () => {
          resolve()
          callback()
        }
      )
    })
  }

  render() {
    const { init, rules, label, formItemLayout, changeOnSelect = false } = this.props
    const { dataSource } = this.state
    const params = {}
    if (rules) {
      params.rules = rules
    }

    return (
      <FormItem
        label={label}
        {...formItemLayout}>
        <CascaderSelect
          changeOnSelect={changeOnSelect}
          dataSource={dataSource}
          loadData={({ pos, value }, callback) => this.onSelect({ pos, value }, callback)}
          {...init('ripeness',{
            initValue: '',
            ...params
          })}/>
      </FormItem>
    )
  }
}

function transform(data, isLeaf) {
  const temp = { isLeaf: true }
  if (isLeaf != deepnessLength - 1) {
    delete temp.isLeaf
  }
  return data.map(item => ({
    label: item.codeValue,
    value: item.code + '',
    ...temp
  }))
}