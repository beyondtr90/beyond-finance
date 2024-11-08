"use client"
import { QRCodeCanvas } from "qrcode.react";
import React from 'react'

function QRCode({ invitationCode }) {
  return (
    <QRCodeCanvas
    value={`https://beyond00/register?code=${invitationCode}`}
    size={100}
    fgColor="#000000"
    bgColor="#ffffff"
    level="Q"
  />
  )
}

export default QRCode