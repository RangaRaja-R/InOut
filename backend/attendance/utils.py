from geopy.distance import geodesic


def is_within_radius(employee_loc, current_loc, radius=200):
    distance = geodesic(employee_loc, current_loc).meters
    print(str(round(distance, 3))+"m")
    return distance <= radius
