<template>
  <div class="map-address">
    <div class="search">
      <van-field v-model="keyWords" id="keyWords" placeholder="请输入关键词" />
    </div>
    <div id="container"></div>
    <div class="address-list">
      <ul>
        <li
          v-for="item in address_list"
          :key="item.id"
          @click="sureAddress(item)"
        >
          <p class="name">{{ item.name }}</p>
          <p class="detail">{{ item.address }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// import AMapLoader from "@amap/amap-jsapi-loader";
window._AMapSecurityConfig = {
  securityJsCode: "da22dbc9db9a93fc05100288f88e4bfd"
};
import AMapLoader from "@amap/amap-jsapi-loader";
let AMap = null;
export default {
  name: "Map",
  props: {
    data: {},
	  position: {
	      type: Array,
	      default: () => []
	    }
  },
  data() {
    return {
      address: "",
      districtList: "",
      cityCode: "",
      keyWords: "",
      map: {},
      marker: {},
      position: [],
      address_list: [],
    };
  },
  watch:{
	      position: {
	        immediate: true,
	        handler(newPosition) {

	          if (newPosition.length === 2) {
	            this.map.setCenter(newPosition);
	            if (this.marker) {
	              this.marker.setPosition(newPosition);
	            } else {
	              this.marker = new AMap.Marker({
	                           position: this.localPosition,
	                           map: this.map
	              });
	            }
	          }
	        }
	      }
  },
  created() {
    console.log("1111");
    this.initAMap();
  },
  methods: {
    // 地图初始化
    initAMap() {
      let that = this;
      AMapLoader.load({
        key: "53f2b22e44b4f9712315d6a00a31c775", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0",
        plugins: []
      })
        .then(Amap => {
          AMap = Amap;
          // 其他功能同h5
          this.map = new AMap.Map("container", {
            // viewMode: "3D",
            center: [116.857461, 38.310582], // 地图中心点坐标
            zoom: 15 // 地图缩放级别
          });
          this.getLocation();
        })
        .catch(e => {
          console.log("高德地图加载错误", e);
        });
    },

    // 获取位置
    getLocation() {
      let that = this;
      AMap.plugin("AMap.Geolocation", function () {
        let geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 10000, // 超过10秒后停止定位，默认：无穷大
          maximumAge: 0, // 定位结果缓存0毫秒，默认：0
          convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true, // 显示定位按钮，默认：true
          buttonPosition: "LB", // 定位按钮停靠位置，默认：'LB'，左下角
          buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          showMarker: true, // 定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true, // 定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: true // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });

        that.map.addControl(geolocation); // 右下角 获取当前位置控件
        // that.map.on("click", showInfoClick);//手动地图选取点位
        // function showInfoClick(e) {
        //   console.log(e, " this. this. this.");
        // }
        // 获取详细地址api
        geolocation.getCurrentPosition(function (status, result) {
          if (status == "complete") {
            onComplete(result);
          } else {
            onError(result);
          }
        });
        function onComplete(data) {
          // data是具体的定位信息
          // alert(JSON.stringify(data));
          that.position = data.position;
          that.searchNear(that.position);
        }

        function onError(data) {
          // 定位出错
          console.log(data, "onError");
        }
      });
    },

    // 周边搜索
    searchNear() {
      let that = this;
      AMap.plugin(["AMap.AutoComplete", "AMap.PlaceSearch"], function () {
        var autoOptions = {
          // 城市，默认全国
          city: "",
          // 使用联想输入的input的id
          input: "keyWords",
          datatype: "poi" // 返回的数据类型
        };
        var autocomplete = new AMap.AutoComplete(autoOptions);
        const placeSearch = new AMap.PlaceSearch({
          city: "", // 兴趣点城市，支持城市名、citycode、adcode
          citylimit: false, // 是否强制在设置的城市内搜索，默认false
          type: "商务住宅|公司企业|餐饮服务|科教文化服务|政府机构及社会团体", // 兴趣点类别，用‘|’分隔，默认：'餐饮服务|商务住宅|生活服务'
          // type: "公司企业", // 兴趣点类别，用‘|’分隔，默认：'餐饮服务|商务住宅|生活服务'
          pageSize: 30, // 每页条数，默认10，范围1-50
          pageIndex: 1, // 页码
          extensions: "all", // 默认base，返回基本地址信息；all：返回详细信息
          map: that.map, // 地图实例，可选
          // panel: 'panel', // 结果列表的id容器，可选
          autoFitView: true // 是否自动调整地图视野到marker点都处于可见范围
        });

        function select(e) { // 选中地址处理的事件
          that.position = [e.poi.location.lng, e.poi.location.lat];
          placeSearch.setCity(e.poi.adcode);
          placeSearch.search(e.poi.name); // 关键字查询查询
          placeSearch.searchNearBy("", that.position, 2000, function (status, result) {
            if (result.poiList && result.poiList.pois) {
              that.address_list = result.poiList.pois;
            } else {
              console.log('未找到周边兴趣点', result);
              that.address_list = [];
            }
          });

          // 在地图上定位所选地点
          that.map.setCenter(that.position);
          if (that.marker) {
            that.marker.setPosition(that.position);
          } else {
            that.marker = new AMap.Marker({
              position: that.position,
              map: that.map
            });
          }
        }

        autocomplete.on("select", select); // 注册监听，当选中某条记录时会触发
        //  alert(JSON.stringify(that.position));
        placeSearch.searchNearBy("", that.position, 2000, function (status, result) {
          if (result.poiList && result.poiList.pois) {
            that.address_list = result.poiList.pois;
          } else {
            console.log('未找到周边兴趣点', result);
            that.address_list = [];
          }
        });
      });
    },

    // 确认地址
    sureAddress(item) {
      this.keyWords = item.name;
      this.position = [item.location.lng, item.location.lat];
      this.map.setCenter(this.position);
      if (this.marker) {
        this.marker.setPosition(this.position);
      } else {
        this.marker = new AMap.Marker({
          position: this.position,
          map: this.map
        });
      }
      // 触发自定义事件将地址信息传递给父组件
      this.$emit('addressInfo', {
        name: item.name,
        address: item.address,
        position: this.position
      });
    }
  }
};
</script>

<style lang="less" scoped>
.map-address {
  height: inherit;
  #container {
    width: 100vw;
    height: 150px;
  }
  .address-list {
    // height: 238px;
    overflow: auto;
    ul {
      li {
        padding: 6px;
        border-bottom: 1px solid #ddd;
        p:nth-of-type(1) {
          color: #333;
          font-size: 14px;
        }
        p:nth-of-type(2) {
          color: #666;
          font-size: 12px;
        }
      }
    }
  }
}
</style>