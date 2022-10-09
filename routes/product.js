var express = require('express');
var router = express.Router();

const productController = require('../components/products/product_controller');
const categoryController = require('../components/categories/category_controller');
const middleware = require('../middleware/upload');

/* GET products listing.
http://localhost:1304/san-pham */
router.get('/', async function(req, res, next) {
    if (!req.session || !req.session.user){
        res.redirect('/dang-nhap');
      }else{
        const {page, size} = req.query;
        const products = await productController.getAll(page, size);
        res.render('table', {products});
      }
});
//Add product http://localhost:1304/san-pham/them-san-pham*/
router.get('/them-san-pham', async function(req, res, next){
    if (!req.session || !req.session.user){
        res.redirect('/dang-nhap');
      }else{
        const categories = await categoryController.get();
        res.render('empty_product_form', {categories});
      }
})
//middleware
router.post('/them-san-pham',[middleware.single('image')], async function(req, res, next){
      // const {name, price, quantity, category_id} = req.body;
      // res.render('empty_product_form', {categories});
      let {body, file} = req; 
      if(file){
        let image = `https://product-manage-v1.herokuapp.com/images/data/${file.filename}`;
        // console.log(image);
        body = {...body, image: image}
      }
      await productController.insert(body);

      res.redirect('/san-pham');
});
/*Get product by ID
http://localhost:1304/san-pham*/
router.get('/detail/:id', async function(req, res, next){
    const {id} = req.params;// hoặc const _id = req.params.id
    const {product, categories} = await productController.getById(id);
    // const categories = await categoryController.get();
    res.render('product_form', {product, categories});
    console.log({product}, id);
});

router.post('/detail/:id',[middleware.single('image')], async function(req, res, next){
  let {body, file} = req;
  
  const {id}=req.params;
  delete body.image;
  if(file){
    let image = `https://product-manage-v1.herokuapp.com/images/data/${file.filename}`;
    body = {...body, image:image};
  }
  await productController.update(id, body);
  res.redirect('/san-pham');
});

router.post('/remove/:id', async function(req, res, next){
  let{id} = req.params;
  await productController.deleteById(id);
  res.json({success:true});
});
module.exports = router;
