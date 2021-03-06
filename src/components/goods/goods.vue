<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item, index) in goods" :key="index" class="menu-item"
            :class="{'current': currentIndex === index}" @click="selectMenu(index, $event)">
          <span class="text border-1px">
            <span class="icon" v-show="item.type>0" :class="classMap[item.type]"></span>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="goods-wrapper" ref="foodsWrapper">
      <ul>
        <li class="food-list" v-for="(item, index) in goods" ref="foodList">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" class="food-item border-1px">
              <div class="icon">
                <img width="57" height="57" :src="food.icon" />
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span><span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food" @add="addFood"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart ref="shopcart" :selectFoods="selectFoods" :deliveryPrice="seller.deliveryPrice"
              :minPrice="seller.minPrice"></shopcart>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import shopcart from '../shopcart/shopcart.vue';
  import cartcontrol from '../cartcontrol/cartcontrol.vue'

  export default {
    components: {
      shopcart,
      cartcontrol
    },

    props: {
      seller: {
        type: Object
      }
    },

    data () {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0
      }
    },

    created () {
      this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];
      this.$http.get('/api/goods').then(response => {
        response = response.body;
        if (response.errno === 0) {
          this.goods = response.data;
          this.$nextTick(() => {
            this._initScroll();
            this._calculateHeight();
          })
        }

      })
    },

    computed: {
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || this.scrollY >= height1 && this.scrollY < height2) { // !height 最后一个
            return i
          }
        }

        return 0
      },
      selectFoods() {
        let foods = [];
        this.goods.forEach(good => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food)
            }
          })
        });

        return foods;
      }
    },

    methods: {
      selectMenu(index, event) {
        if (!event._constructed) {
          return;
        } // 浏览器中原生属性event是没有_constructed，这个属性是better-scroll自带的
        let foodList = this.$refs.foodList;
        let el = foodList[index];

        this.foodScroll.scrollToElement(el, 300); // 300为动画事件
      },

      _drop(target) {
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target); // 使用父组件调用子组件方法
        })
      },

      _initScroll () {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true // 在pc端会触发点击两次
        });

        this.foodScroll = new BScroll(this.$refs.foodsWrapper, {
          probeType: 3, // 监听事件
          click: true
        });

        this.foodScroll.on('scroll', pos => {
          this.scrollY = Math.abs(Math.round(pos.y))
        })
      },

      _calculateHeight () {
        let foodList = this.$refs.foodList;
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          height += foodList[i].clientHeight;
          this.listHeight.push(height)
        }
      },

      addFood(target) {
        this._drop(target)
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .goods
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px // 左边固定宽度80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table // 垂直居中
        line-height: 14px
        height: 54px
        width: 56px
        padding: 0 12px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: indianred
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          width: 12px
          height: 12px
          vertical-align: top
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display: table-cell // 每一个格子
          width: 56px
          vertical-align: middle // 垂直居中
          font-size: 12px
          border-1px(rgba(7, 17, 27, 0.1))

    .goods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &.last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
</style>
