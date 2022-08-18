import { BadRequestException, HttpException, NotFoundException } from '@nestjs/common'
import dayjs from 'dayjs'

export const getDateString = () => dayjs().format('YYYY-MM-DD')

export const getDateTimeString = () => dayjs().format('YYYY-MM-DD HH:mm:ss')

export const getTimestamp = () => Math.floor(+new Date() / 1000)

export const assert = function (condition, status, error = '异常错误') {
  if (!condition) throw new HttpException(error, status)
}

export const assertParams = function (condition, message = '参数错误') {
  if (!condition) throw new BadRequestException(message)
}

export const assertExists = function (condition) {
  if (!condition) throw new NotFoundException()
}

export const assertObjectNotEmpty = function (obj, message = '参数错误') {
  if (Object.keys(obj).length === 0) throw new BadRequestException(message)
}
