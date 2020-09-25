// db.collection("courses").get()
//     .then(res => res.docs.forEach(course => {
//         showCourse(course.data(), course.id)
//     }))
//     .catch(err => console.error(err))

let list = document.querySelector('ul');
let form = document.querySelector('form');

const showCourse = (course, id) => {
  const html = `
        <li class="list-group-item" data-id="${id}">
            <h2 class="text-info">${course.title}</h2>
            <small>${course.created_at.toDate()}</small>
            <button class="btn btn-danger btn-sm my-3">Delete</button>
        </li>
    `;

  list.innerHTML += html;
};

const deleteCourse = (id) => {
  const courses = document.querySelectorAll('li');

  courses.forEach((course) => {
    if (course.getAttribute('data-id') === id) {
      course.remove();
    }
  });
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const now = new Date();

  const course = {
    title: form.course.value,
    created_at: firebase.firestore.Timestamp.fromDate(now),
  };

  form.reset();

  db.collection('courses')
    .add(course)
    .then((res) => {})
    .catch((err) => console.error('error'));
});

list.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    let id = e.target.parentElement.getAttribute('data-id');

    if (!confirm('Are you sure to delete this course ?')) {
      return;
    }

    db.collection('courses')
      .doc(id)
      .delete()
      .then((res) => {})
      .catch((err) => console.error('error'));
  }
});

db.collection('courses').onSnapshot((snap) => {
  snap.docChanges().forEach((course) => {
    if (course.type === 'added') {
      showCourse(course.doc.data(), course.doc.id);
    } else {
      deleteCourse(course.doc.id);
    }
  });
});
