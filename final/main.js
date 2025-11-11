$(function () {

  // Fade-in on scroll
  $(window).on('scroll', function () {
    $('.fade-section').each(function () {
      if ($(window).scrollTop() + $(window).height() > $(this).offset().top + 100) {
        $(this).addClass('visible');
      }
    });
  }).trigger('scroll');

  // Contact form validation
  $('#contactForm').on('submit', function (e) {
    e.preventDefault();
    const name = $('#contactName').val().trim();
    const email = $('#contactEmail').val().trim();
    const msg = $('#contactMsg').val().trim();
    if (!name || !email || !msg) return alert('Please fill in all fields.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert('Invalid email.');
    alert('Message sent successfully!');
    this.reset();
  });

  // Quote form (index.html)
  $('#quoteForm').on('submit', function (e) {
    e.preventDefault();
    const name = $('#quoteName').val().trim();
    const email = $('#quoteEmail').val().trim();
    const details = $('#quoteDetails').val().trim();
    if (!name || !email || !details) return alert('Fill in all fields.');
    alert('Quote request sent!');
    this.reset();
  });

  // Service search
  $('#serviceSearch').on('input', function () {
    const q = $(this).val().toLowerCase();
    $('.service').each(function () {
      $(this).toggle($(this).text().toLowerCase().includes(q));
    });
  });

  // Filter gallery
  $('.filter-btn').on('click', function () {
    const f = $(this).data('filter');
    if (f === 'all') $('.project').show();
    else {
      $('.project').hide();
      $('.' + f).show();
    }
  });

  // CRUD table
  const STORAGE_KEY = 'projects';
  let projects = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  render();

  $('#projectForm').on('submit', function (e) {
    e.preventDefault();
    const name = $('#projName').val().trim();
    const type = $('#projType').val().trim();
    const cost = $('#projCost').val().trim();
    if (!name || !type || !cost) return alert('Fill all fields');
    projects.push({ name, type, cost });
    save();
    render();
    this.reset();
  });

  $(document).on('click', '.delete-btn', function () {
    const i = $(this).data('i');
    projects.splice(i, 1);
    save();
    render();
  });

  $(document).on('click', '.edit-btn', function () {
    const i = $(this).data('i');
    const p = projects[i];
    const name = prompt('Edit name', p.name);
    if (name === null) return;
    const type = prompt('Edit type', p.type);
    if (type === null) return;
    const cost = prompt('Edit cost', p.cost);
    if (cost === null) return;
    projects[i] = { name, type, cost };
    save();
    render();
  });

  function render() {
    const tbody = $('#projectTable tbody');
    tbody.empty();
    if (!projects.length) {
      tbody.append('<tr><td colspan="4">No projects yet</td></tr>');
      return;
    }
    projects.forEach((p, i) => {
      tbody.append(`
        <tr>
          <td>${p.name}</td>
          <td>${p.type}</td>
          <td>${p.cost}</td>
          <td>
            <button class="btn btn-sm btn-info edit-btn" data-i="${i}">Edit</button>
            <button class="btn btn-sm btn-danger delete-btn" data-i="${i}">Delete</button>
          </td>
        </tr>
      `);
    });
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }

});

// === PASSWORD STRENGTH FUNCTION ===
function getStrength(pwd) {
  let s = 0;
  if (pwd.length >= 6) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
}

function showStrength(bar, level) {
  const colors = ['#dc3545', '#fd7e14', '#ffc107', '#28a745'];
  const texts = ['Weak', 'Fair', 'Good', 'Strong'];
  bar.css({
    width: (level * 25) + '%',
    backgroundColor: colors[level - 1] || '#ddd'
  }).text(level ? texts[level - 1] : '');
}

// === Strength on input ===
$('#quotePassword').on('input', function () {
  const lvl = getStrength($(this).val());
  showStrength($('#quoteStrength'), lvl);
});
$('#contactPassword').on('input', function () {
  const lvl = getStrength($(this).val());
  showStrength($('#contactStrength'), lvl);
});

// === Quote Form Validation ===
$('#quoteForm').on('submit', function (e) {
  e.preventDefault();
  const name = $('#quoteName').val().trim();
  const email = $('#quoteEmail').val().trim();
  const details = $('#quoteDetails').val().trim();
  const pass = $('#quotePassword').val();
  const confirm = $('#quoteConfirm').val();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !email || !details || !pass || !confirm)
    return alert('Please fill in all fields.');
  if (!emailRegex.test(email))
    return alert('Invalid email.');
  if (pass !== confirm)
    return alert('Passwords do not match.');

  alert('Quote request submitted successfully!');
  this.reset();
  $('#quoteStrength').css('width', '0%').text('');
  $('#quoteModal').modal('hide');
});

// === Contact Form Validation ===
$('#contactForm').on('submit', function (e) {
  e.preventDefault();
  const name = $('#contactName').val().trim();
  const email = $('#contactEmail').val().trim();
  const msg = $('#contactMsg').val().trim();
  const pass = $('#contactPassword').val();
  const confirm = $('#contactConfirm').val();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !email || !msg || !pass || !confirm)
    return alert('Please fill in all fields.');
  if (!emailRegex.test(email))
    return alert('Invalid email.');
  if (pass !== confirm)
    return alert('Passwords do not match.');

  alert('Message sent successfully!');
  this.reset();
  $('#contactStrength').css('width', '0%').text('');
});
