module.exports = function(eleventyConfig) {  
  // Add a filter using the Config API  
  // eleventyConfig.addFilter( "myFilter", function() {}); 
  // Make eleventy aware of SASS files
  eleventyConfig.addWatchTarget("styles"); 
  // copy crucial folders as subdirectories of output folder
  eleventyConfig.addPassthroughCopy("styles");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("data");
  eleventyConfig.addPassthroughCopy("images");
  // You can return your Config object (optional).  
  return {    
    dir: {
      input: ".",
      includes: "partials",
      output: "../build",
    },
    templateFormats: ["css", "html", "pug"] 
  };
};
