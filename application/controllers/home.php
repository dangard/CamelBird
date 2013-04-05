<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Home extends CI_Controller {
	public function index ()
	{
		$this->load->model('jobs_model');
		$data['rows'] = $this->jobs_model->getAll();
		$data['date'] = date('Y');
		$data['title'] = 'Blah blah blah!!!';
        $data['main_content'] = 'home.tpl';
		$this->smarty->view( 'includes/template.tpl', $data );
	}

    public function demo() {
        $data['main_content'] = 'demo.tpl';
        $this->smarty->view( 'includes/template.tpl', $data );
    }
}