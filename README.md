# 我的記帳簿

由Node.js 及 express 打造而成的網頁記帳簿

## 預覽

### 登入首頁

![image](https://github.com/hijerry1007/myAccount/blob/master/photos/login.png)

### 首頁

![image](https://github.com/hijerry1007/myAccount/blob/master/photos/homepage.png)


## 安裝

1. 打開你的Termianl，複製此專案至本機電腦 
2. 開啟終端機，進入存放此專案的資料夾myAccount
3. 安裝npm在Terminal輸入npm install指令
4. 安裝nodemon套件(express/express-handblebars/body-parser/mongoose/methodoverride/express-session/passport/passport-local/passport-facebook/bcryptjs/connect-flash) 
5. Terminal輸入npm run seeder 建立種子檔案
6. Terminal輸入 npm run dev指令
7. 輸入本機地址localhost:3000 即可瀏覽此頁面

## 功能列表

開放帳戶註冊
可使用Facebook帳號連結

使用者可自行新增自己的支出項目並計算支出總金額

目前類別為五種: 家居物業/運輸交通/休閒娛樂/餐飲食品/其他
搜尋: 可依據時間或分類搜尋支出項目
