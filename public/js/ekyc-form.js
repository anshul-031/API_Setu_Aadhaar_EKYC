class EkycForm {
  constructor() {
    this.state = {
      isLoading: false,
      showOTP: false,
      txnId: '',
      userData: null
    };
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setLoading = this.setLoading.bind(this);
  }

  init() {
    this.render();
  }

  setLoading(loading) {
    this.state.isLoading = loading;
    const loader = document.querySelector('.loader');
    const submitBtn = document.getElementById('submit-btn');
    
    if (loader && submitBtn) {
      loader.classList.toggle('hidden', !loading);
      submitBtn.disabled = loading;
    }
  }

  async generateOTP(aadhaarNumber) {
    try {
      const response = await fetch('/api/aadhaar/generate-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadhaarNumber }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate OTP');
      
      this.state.txnId = data.txnId;
      this.state.showOTP = true;
      this.render();
      
      alert('OTP sent to your registered mobile number');
    } catch (error) {
      alert(error.message);
    }
  }

  async verifyOTP(aadhaarNumber, otp) {
    try {
      const response = await fetch('/api/aadhaar/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aadhaarNumber,
          otp,
          txnId: this.state.txnId
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to verify OTP');
      
      this.state.userData = data.eKycData;
      this.render();
      
      alert('eKYC verification successful');
    } catch (error) {
      alert(error.message);
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    
    if (this.state.isLoading) return;
    this.setLoading(true);

    try {
      const form = event.target;
      const aadhaarNumber = form.aadhaar.value;

      if (!this.state.showOTP) {
        await this.generateOTP(aadhaarNumber);
      } else {
        const otp = form.otp.value;
        await this.verifyOTP(aadhaarNumber, otp);
      }
    } finally {
      this.setLoading(false);
    }
  }

  attachEventListeners() {
    const form = document.getElementById('aadhaar-form');
    if (form) {
      form.removeEventListener('submit', this.handleSubmit);
      form.addEventListener('submit', this.handleSubmit);
    }
  }

  render() {
    const container = document.getElementById('ekyc-form');
    if (!container) return;

    container.innerHTML = `
      <div class="w-full max-w-md mx-auto bg-white rounded-lg shadow-md">
        <div class="p-6">
          <h2 class="text-xl font-semibold mb-4">Aadhaar eKYC Verification</h2>
          <p class="text-gray-600 mb-6">Verify your identity using Aadhaar eKYC</p>
          
          <form id="aadhaar-form" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1" for="aadhaar">
                Aadhaar Number
              </label>
              <input
                type="text"
                id="aadhaar"
                name="aadhaar"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter 12 digit Aadhaar number"
                pattern="\\d*"
                maxlength="12"
                required
                ${this.state.showOTP ? 'disabled' : ''}
                autocomplete="off"
              />
            </div>

            ${this.state.showOTP ? `
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1" for="otp">
                  OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter 6 digit OTP"
                  pattern="\\d*"
                  maxlength="6"
                  required
                  autocomplete="off"
                />
              </div>
            ` : ''}

            <button
              id="submit-btn"
              type="submit"
              class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
              ${this.state.isLoading ? 'disabled' : ''}
            >
              <span class="loader hidden mr-2">
                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              </span>
              ${this.state.showOTP ? 'Verify OTP' : 'Generate OTP'}
            </button>
          </form>

          ${this.state.userData ? `
            <div class="mt-6 border-t pt-6">
              <h3 class="text-lg font-semibold mb-4">User Details</h3>
              <div class="space-y-2">
                <p><strong>Name:</strong> ${this.state.userData.name}</p>
                <p><strong>Gender:</strong> ${this.state.userData.gender}</p>
                <p><strong>DOB:</strong> ${this.state.userData.dob}</p>
                <p><strong>Address:</strong> ${this.state.userData.address}</p>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    this.attachEventListeners();
  }
}

// Initialize the form when the DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const form = new EkycForm();
    form.init();
  });
} else {
  const form = new EkycForm();
  form.init();
}