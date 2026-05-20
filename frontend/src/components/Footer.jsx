function Footer() {
  return (
    <footer className="bg-black/50 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-gray-400 text-sm font-medium mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="hover:text-gray-300 cursor-pointer">About Us</li>
              <li className="hover:text-gray-300 cursor-pointer">Careers</li>
              <li className="hover:text-gray-300 cursor-pointer">Press</li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-400 text-sm font-medium mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="hover:text-gray-300 cursor-pointer">Help Center</li>
              <li className="hover:text-gray-300 cursor-pointer">Contact Us</li>
              <li className="hover:text-gray-300 cursor-pointer">FAQ</li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-400 text-sm font-medium mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="hover:text-gray-300 cursor-pointer">Privacy Policy</li>
              <li className="hover:text-gray-300 cursor-pointer">Terms of Service</li>
              <li className="hover:text-gray-300 cursor-pointer">Cookie Policy</li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-400 text-sm font-medium mb-3">Follow Us</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="hover:text-gray-300 cursor-pointer">Twitter</li>
              <li className="hover:text-gray-300 cursor-pointer">Instagram</li>
              <li className="hover:text-gray-300 cursor-pointer">YouTube</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-600 text-sm border-t border-gray-800 pt-6">
          &copy; {new Date().getFullYear()} Streamify. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
