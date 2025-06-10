"use client"

import React from "react"
import InputMask from "react-input-mask"
import { Input } from "./shadcn/ui/input"

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: string
  mask: string
  maskChar?: string | null
  alwaysShowMask?: boolean
}

const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ type = "text", mask, maskChar = null, alwaysShowMask = false, className, ...props }, ref) => {
    return (
      <InputMask
        mask={mask}
        maskChar={maskChar}
        alwaysShowMask={alwaysShowMask}
        {...props}
      >
        {(inputProps: React.InputHTMLAttributes<HTMLInputElement>) => (
          <Input
            type={type}
            {...inputProps}
            ref={ref}
            className={className}
          />
        )}
      </InputMask>
    )
  }
)

MaskedInput.displayName = "MaskedInput"

export { MaskedInput }
