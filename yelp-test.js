axios({
  method: "get",
  headers: ("Authorization", "Bearer iqXLcNktZ-2mNihPdZnuTJfCh_bKqZfFxhjU15MiFxVFF2bP1FiZ1boI29rOIzRajnPqXfqg__V6hWUmLTYfI2ovojKHGXqR-EIzm7PlSAHAF-7hntr_H_buB3KnYXYx"),
  redirect: "follow",
  url: "https://api.yelp.com/v3/businesses/search?term=Landmark&latitude=37.786882&longitude=-122.399972",
  })
  .then(function (res){
    console.log(res);
  })
  .catch(function (err) {
    console.log(err);
});