"use client"
import { QRCodeCanvas } from "qrcode.react";
import React from 'react'

function QRCode({ value }) {
  return (
    <QRCodeCanvas
    value={value}
    size={100}
    fgColor="#000000"
    bgColor="#ffffff"
    level="Q"
  />
  )
}

export default QRCode