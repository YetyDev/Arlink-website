import shutil
import os

images = {
    r"C:\Users\Dell\.gemini\antigravity-ide\brain\26c4479a-28fc-4f2d-8deb-e56f3d944dff\service_flight_booking_1781544114093.png": r"images\service_flight_booking.png",
    r"C:\Users\Dell\.gemini\antigravity-ide\brain\26c4479a-28fc-4f2d-8deb-e56f3d944dff\service_hotel_stay_1781544128440.png": r"images\service_hotel_stay.png",
    r"C:\Users\Dell\.gemini\antigravity-ide\brain\26c4479a-28fc-4f2d-8deb-e56f3d944dff\service_travel_insurance_1781544142711.png": r"images\service_travel_insurance.png",
    r"C:\Users\Dell\.gemini\antigravity-ide\brain\26c4479a-28fc-4f2d-8deb-e56f3d944dff\service_airport_transfer_1781544156560.png": r"images\service_airport_transfer.png",
    r"C:\Users\Dell\.gemini\antigravity-ide\brain\26c4479a-28fc-4f2d-8deb-e56f3d944dff\service_holiday_packages_1781544170841.png": r"images\service_holiday_packages.png"
}

os.makedirs("images", exist_ok=True)

for src, dst in images.items():
    print(f"Copying {src} to {dst}")
    shutil.copy(src, dst)

print("Done!")
