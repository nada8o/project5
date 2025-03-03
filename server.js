const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');


// تحميل متغيرات البيئة من ملف config.env
dotenv.config({ path: 'config.env' });

// الاتصال بقاعدة البيانات
mongoose
  .connect(process.env.DB_URI) // استخدام متغير البيئة DB_URI
  .then((conn) => {
    console.log(`Database Connected: ${conn.connection.host}`); // طباعة رسالة نجاح الاتصال
  })
  .catch((err) => {
    console.error(`Database Error: ${err}`); // طباعة رسالة الخطأ
    process.exit(1); // إغلاق التطبيق في حالة فشل الاتصال
  });

// إنشاء تطبيق Express
const app = express();

// Middleware لتحليل طلبات JSON
app.use(express.json());

// استخدام morgan لتسجيل طلبات HTTP في وضع التطوير
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// تعريف Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
});

// تعريف الموديل
const CategoryModel = mongoose.model('Category', categorySchema);

// تعريف route لـ POST
app.post('/', (req, res) => {
  const { name } = req.body; // استخراج name من body الطلب
  console.log(req.body); // طباعة body الطلب لأغراض debugging

  // إنشاء وثيقة جديدة
  const newCategory = new CategoryModel({ name });

  // حفظ الوثيقة في قاعدة البيانات
  newCategory
    .save()
    .then((doc) => {
      res.json(doc); // إرسال الوثيقة المحفوظة كرد JSON
    })
    .catch((err) => {
      res.status(500).json(err); // إرسال الخطأ كرد JSON مع حالة HTTP 500
    });
});

// تعريف route لـ GET
app.get('/', (req, res) => {
  res.send('Our API v9');
});

// بدء تشغيل الخادم
const PORT = process.env.PORT || 8006;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});