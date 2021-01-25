import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import { Model } from '../src'

Model.$http = axios
export const axiosMock = new MockAdapter(axios)

beforeEach(() => {
  axiosMock.reset()
})
