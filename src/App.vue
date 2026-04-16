<template>
    <div class="common-layout">
        <el-card :key="idx" v-for="(v, idx) in hotlist_data">
            <div class="div-head">
                <h3>{{ v.name }}</h3>
            </div>
            <div class="inner">
                <ul class="hot-list-article">
                    <li v-for="subItem in v.value" :key="subItem.id"> <a :href="subItem.url" target="_blank" draggable="false" rel="noopener noreferrer">{{subItem.title }}</a></li>
                </ul>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted, onUnmounted } from 'vue';
import { ElLoading, ElMessage } from "element-plus";

const hotlist = ref([])
const hotlist_data:any = ref([])
const http = axios.create()
onMounted(() => {
    let loadingService = ElLoading.service({fullscreen: true, text: "正在加载资源 ~"});
    http.get("https://api.pearktrue.cn/api/dailyhot/").then((res:any)=>{
        hotlist.value = res.data.data.platforms;
        for (let i = 0; i < hotlist.value.length; i++) {
            http.get(`https://api.pearktrue.cn/api/dailyhot/?title=${hotlist.value[i]}`).then((res: any) => {
                if (res.data.data.length > 1) hotlist_data.value.push({"name": hotlist.value[i], "value": res.data.data.slice(0, 100)});
            })
        }
        loadingService.close();
    }).catch(()=>{
        loadingService.close();
        ElMessage({ type: "error", message: "加载失败，请稍后再试 ~", duration: 1000 });
    })
    document.getElementsByTagName("html")[0].classList.add("dark");
})
onUnmounted(() => {
    document.getElementsByTagName("html")[0].classList.remove("dark");
    window.history.pushState(null, "", window.location.href =  "/index");
})
</script>

<style scoped lang="less">
.common-layout {
    width: 100%;
    height: 100%;
    overflow: auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    padding: 0 10px;
    overflow: auto;
    box-sizing: border-box;

    .el-card {
        width: 100%;
        height: 475px;
        border-radius: 20px;
        .div-head {
            margin-top: -35px;
            height: 30px;
            line-height: 30px;
            text-align: center;
        }
        .inner {
            height: 420px;
            width: inherit;
            overflow: hidden;

            .hot-list-article li {
                display: block;
                line-height: 32px;
                position: relative;
                counter-increment: nums;
                padding-left: 80px;
                width: inherit;
                margin-left: -40px;
            }
            .hot-list-article li a {
                position: relative;
                left: -40px;
                color: #787977;
                text-decoration: none;
            }

            .hot-list-article li:before {
                color: #000;
                width: 22px;
                height: 22px;
                line-height: 22px;
                text-align: center;
                content: counter(nums, decimal);
                position: absolute;
                left: 0;
                top: 5px;
                border-radius: 100%;
                background-color: #edefee;
                text-shadow: 0 1px 0 rgba(255, 255, 255, .5);
                font-family: SourceCodeProRegular, Menlo, Monaco, Consolas, "Courier New", monospace, 'Helvetica Neue', Arial, sans-serif
            }

            .hot-list-article li:first-child:before,
            .hot-list-article li:nth-child(2):before,
            .hot-list-article li:nth-child(3):before {
                color: #fff;
                text-shadow: none
            }

            .hot-list-article li:first-child:before {
                background-color: #e24d46
            }

            /*第1行的行号样式*/
            .hot-list-article li:nth-child(2):before {
                background-color: #2ea7e0
            }

            /*第2行的行号样式*/
            .hot-list-article li:nth-child(3):before {
                background-color: #6bc30d
            }

            /*第3行的行号样式*/
            .hot-list-article li:hover {
                a {
                    text-decoration: underline;
                    font-size: large;
                    display: inline-block;
                    transition: transform 0.3s ease-in-out;
                    transform: translateX(5px);
                }
            }
        }

        .inner:hover {
            overflow: auto;
        }
    }
}
</style>