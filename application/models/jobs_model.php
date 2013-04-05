<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Jobs_model extends CI_Model {
	public function getAll() {
		$q = $this->db->get('jobs');
		
		if ($q->num_rows() > 0) {
			foreach ($q->result() as $row)
			{
				$data[] = $row;
			}
			return $data;
		}
	}
}