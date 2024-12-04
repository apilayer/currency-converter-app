# Currency Converter App

![Currency Converter App Screenshot](/screenshot.png)

A web application that converts one currency to another currency and shows the change in currency rate overtime in graphical representation.

Built with React.js, [IPStack API](https://ipstack.com/), and [Exchange Rate API](https://exchangeratesapi.io/), it shows the value of one currency to another currency

## Features

- 📍 Automatic user location detection using IPStack API
- 📰 Currency rate of currency from Exchange Rate API
- 🌐 Support for multiple currencies worldwide
- 📱 Shows rate fo currency in graphical representation

## Installation

To set up the Currency Converter App project locally, follow these steps:

1. Clone the repository:

   ```
   git clone https://github.com/apilayer/currency-converter-app.git
   ```

2. Navigate to the project directory:

   ```
   cd currency-converter-app
   ```

3. Install the dependencies:

   ```
   npm install
   ```

4. Create a `.env.local` file in the root directory and add your API keys:

   ```
   VITE_IPSTACK_API_KEY=your_ipstack_api_key_here
   VITE_EXCHANGE_RATE_API_KEY=your_exchange_rate_api_key_here
   ```

5. Run the development server:

   ```
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Upon loading, the app will attempt to detect your current location using the IPStack API.
2. Once your location is determined, the app will show your local currency.
3. Select the desired currency in which you want to convert your local currency and it will fetch the currency value using Exchange Rate API

## Technologies Used

- [React](https://reactjs.org/)
- [IPStack API](https://ipstack.com/) for geolocation
- [Exchange Rate API](exchangeratesapi.io/) for currencies values

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.
