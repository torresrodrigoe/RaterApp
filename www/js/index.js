
var app = {
    initialize: function () {
        this.bindEvents();
        this.setupVue();
        appVue.$mount('.itemapp');
        /*appVue.$on('test', function (msg) {
            console.log(msg);
        });*/
    },
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
    },
    receivedEvent: function (id) {
        console.log('Received Event: ' + id);
    },
    setupVue: function () {
        appVue = new Vue({
            data: {
                items: itemStorage.fetch(),
                newItem: '',
                newItemPrice: '',
                newItemAmount: '',
                itemAmountSubtotal: '$0'
            },
            watch: {
                items: {
                    handler: function (items) {
                        itemStorage.save(items)
                    },
                    deep: true
                },
                newItemPrice: function (price) {
                    var item = this.newItem
                    var amount = this.newItemAmount || 1
                    this.newItemPrice = price
                    if (item !== '' && price !== '') {
                        this.itemAmountSubtotal = '$' + price * amount
                    }
                },
                newItemAmount: function (amount) {
                    var item = this.newItem
                    var price = this.newItemPrice
                    amount = this.newItemAmount || 1
                    if (item !== '' && price !== '') {
                        this.itemAmountSubtotal = '$' + price * amount
                    }
                }
            },
            computed: {
                totalPrice: function () {
                    var totalPrice = 0
                    this.items.forEach(function (item) {
                        totalPrice += (item.subtotal)
                    })
                    return totalPrice
                },
            },
            methods: {
                addItem: function () {
                    var name = this.newItem
                    var amount = this.newItemAmount || 1
                    var price = this.newItemPrice
                    this.items.push({
                        id: itemStorage.uid++,
                        title: name,
                        amount: amount,
                        price: price,
                        subtotal: price * amount,
                        completed: false
                    })
                    this.newItem = ''
                    this.newItemAmount = ''
                    this.newItemPrice = ''
                    this.itemAmountSubtotal = '$0'
                },
                removeItem: function (item) {
                    this.items.splice(this.items.indexOf(item), 1)
                }
            }
        });
    }
};

var STORAGE_KEY = 'items-vuejs-2.0';
var itemStorage = {
    fetch: function () {
        var items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        items.forEach(function (item, index) {
            item.id = index
        })
        itemStorage.uid = items.length
        return items
    },
    save: function (items) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
};

app.initialize();
