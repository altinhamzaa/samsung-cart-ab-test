# Samsung UK Cart – UX A/B Test

**Author:** Altin Hamza

## Overview
This project implements a small UX A/B test on the Samsung UK cart page using **plain JavaScript**.  
The script is fully **pasteable in the browser console** and injects all required CSS dynamically.

## How to Run
1. Go to https://www.samsung.com/uk/
2. Add a Galaxy device to the cart
3. Open `/uk/cart`
4. Open DevTools → Console
5. Paste the script and press Enter

## Implemented Changes
- Voucher input hidden behind a **“Have a voucher?”** toggle
- Holiday returns banner refactored into a compact badge near checkout
- Inline **Trade-In teaser** added below product price
- Brand-aware Trade-In copy based on user device

## Notes
- Handles async cart loading and re-renders
- No external libraries used
- Existing Samsung functionality remains unchanged