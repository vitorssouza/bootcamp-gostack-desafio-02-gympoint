import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number().required(),
      height: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const data = req.body;

    const studentExists = await Student.findOne({
      where: { email: data.email },
    });

    if (studentExists) {
      return res.status(400).json({ error: 'Student already exists.' });
    }

    const { id, name, email, provider } = await Student.create(data);

    return res.json({ id, name, email, provider });
  }

  async update(req, res) {
    const { id } = req.params;

    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      age: Yup.number(),
      height: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { email } = req.body;

    const student = await Student.findByPk(id);

    if (email !== student.email) {
      const studentExists = await Student.findOne({ where: { email } });

      if (studentExists) {
        return res
          .status(400)
          .json({ error: 'Already exists an user with this email.' });
      }
    }

    const { name, provider } = await student.update(req.body);

    return res.json({ id, name, email, provider });
  }
}

export default new StudentController();
