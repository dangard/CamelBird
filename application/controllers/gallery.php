<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Gallery extends CI_Controller {
    public function index ()
    {
/*      1. Query the Database for the image objects.
        2. Iterate  over each  image and  build a gllery slot for it.
        3. Render the Gallery.*/
        $this->load->model('photo_model');
        if ($this->photo_model->getAll() != FALSE) {
             $data['row'] = $this->table->generate($this->photo_model->getAll());
        } else {
            $table = array(
                array('Name', 'Color', 'Size'),
                array('Fred', 'Blue', 'Small'),
                array('Mary', 'Red', 'Large'),
                array('John', 'Green', 'Medium')   
            );
            $data['row'] = $this->table->generate($table);
        }
       
        $data['date'] = date('Y');
        $data['main_content'] = 'gallery.tpl';
        $this->smarty->view( 'includes/template.tpl', $data );
    }
}