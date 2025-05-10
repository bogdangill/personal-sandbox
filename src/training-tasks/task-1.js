const solution = () => {
    function Item(id, name, type, stats) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.stats = stats;
    }
    
    const inventoryManager = {
        items: [],
        addItem(item) {
            this.items.push(item);
        },
        getItemAttack(id) {
            return this.items.filter(item => item.id === id)[0]?.stats.attack ?? 0;
        },
        setDefaultStats(id) {
            this.items.map(item => {
                if (item.id === id) {
                    item.stats ??= { attack: 1, defense: 1 };
                }
            });
        }
    }
    
    const sword = new Item(1, "Меч", "weapon", { attack: 15 });
    const shield = new Item(2, "Щит", "armor", { defense: 10 });
    const potion = new Item(3, "Зелье", "consumable"); // stats нет!
    
    inventoryManager.addItem(sword);
    inventoryManager.addItem(shield);
    inventoryManager.addItem(potion);
    
    console.log(inventoryManager.getItemAttack(1)); // 15
    console.log(inventoryManager.getItemAttack(2)); // 0 (нет attack)
    console.log(inventoryManager.getItemAttack(4)); // 0 (нет предмета)
    
    inventoryManager.setDefaultStats(3);
}
export default solution;