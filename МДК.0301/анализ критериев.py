products = {
    'Product_A': {'speed': 8, 'cost': 6, 'features': 9},
    'Product_B': {'speed': 9, 'cost': 7, 'features': 7},
}

weights = {'speed': 0.4, 'cost': 0.3, 'features': 0.3}

def calculate_score(product, weights):
    return sum(product[crit] * weight 
               for crit, weight in weights.items())

