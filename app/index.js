import { Redirect } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

const index = () => {
  return (
    <Redirect href="/(authenticate)/login" />
  )
}

export default index
