module.exports = {
    ensureAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) {
        console.log('Is Authenticated');
        return next();
      }
      req.flash('error_msg', 'Please log in to view that resource');
      console.log('Please log in to view that resource');
      res.redirect('/login');
    },
    forwardAuthenticated: function(req, res, next) {
      if (!req.isAuthenticated()) {
        console.log('Is not Authenticated');
        return next();
      }
      console.log('Is Authenticated');
      res.redirect('/dashboard');      
    }
  };
  