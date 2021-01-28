import 'package:flutter/material.dart';
import 'package:healthcare_app/screens/redeem/redeem_screen.dart';
import 'package:healthcare_app/screens/register/register_screen.dart';
import 'package:healthcare_app/screens/token/token_screen.dart';
import 'package:healthcare_app/screens/transfer/transfer_screen.dart';

class Body extends StatefulWidget {
  Body({Key key}) : super(key: key);
  @override
  _BodyState createState() => _BodyState();
}

class _BodyState extends State<Body> {
  bool _isAgreed = false;

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;

    return Container(
      padding: EdgeInsets.only(top: 40, left: 20, right: 20, bottom: 20),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            Text(
              'Agreement',
              style: TextStyle(fontSize: 40),
            ),
            Container(
                margin: EdgeInsets.only(top: 20),
                padding: EdgeInsets.all(20),
                width: double.infinity,
                decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(10),
                    color: Colors.white,
                    border: Border.all(
                      color: Colors.grey,
                      style: BorderStyle.solid,
                      width: 1,
                    )),
                child: Container(
                    height: screenHeight - 300,
                    child: SingleChildScrollView(
                      child: Text(
                          'Nunc congue turpis eleifend justo suscipit, gravida finibus sapien lacinia. Suspendisse ultricies mi ornare enim imperdiet ullamcorper. Maecenas eu sem faucibus, vulputate eros eu, maximus magna. Mauris tempus non felis id mattis. Donec arcu neque, consequat sed ultrices eu, varius nec ante. Duis sodales odio non elit efficitur dapibus. Nunc eu sagittis libero, in eleifend velit. Curabitur ac tristique tellus. Phasellus in nisl porta, commodo ante ullamcorper, vestibulum ex. Fusce quis erat mauris. Praesent vel lorem eget justo mattis egestas eu eget tortor. Integer mattis, sapien quis efficitur viverra, neque est placerat orci, in sagittis nibh magna et risus. Nunc congue turpis eleifend justo suscipit, gravida finibus sapien lacinia. Suspendisse ultricies mi ornare enim imperdiet ullamcorper. Maecenas eu sem faucibus, vulputate eros eu, maximus magna. Mauris tempus non felis id mattis. Donec arcu neque, consequat sed ultrices eu, varius nec ante. Duis sodales odio non elit efficitur dapibus. Nunc eu sagittis libero, in eleifend velit. Curabitur ac tristique tellus. Phasellus in nisl porta, commodo ante ullamcorper, vestibulum ex. Fusce quis erat mauris. Praesent vel lorem eget justo mattis egestas eu eget tortor. Integer mattis, sapien quis efficitur viverra, neque est placerat orci, in sagittis nibh magna et risus. Nunc congue turpis eleifend justo suscipit, gravida finibus sapien lacinia. Suspendisse ultricies mi ornare enim imperdiet ullamcorper. Maecenas eu sem faucibus, vulputate eros eu, maximus magna. Mauris tempus non felis id mattis. Donec arcu neque, consequat sed ultrices eu, varius nec ante. Duis sodales odio non elit efficitur dapibus. Nunc eu sagittis libero, in eleifend velit. Curabitur ac tristique tellus. Phasellus in nisl porta, commodo ante ullamcorper, vestibulum ex. Fusce quis erat mauris. Praesent vel lorem eget justo mattis egestas eu eget tortor. Integer mattis, sapien quis efficitur viverra, neque est placerat orci, in sagittis nibh magna et risus. Nunc congue turpis eleifend justo suscipit, gravida finibus sapien lacinia. Suspendisse ultricies mi ornare enim imperdiet ullamcorper. Maecenas eu sem faucibus, vulputate eros eu, maximus magna. Mauris tempus non felis id mattis. Donec arcu neque, consequat sed ultrices eu, varius nec ante. Duis sodales odio non elit efficitur dapibus. Nunc eu sagittis libero, in eleifend velit. Curabitur ac tristique tellus. Phasellus in nisl porta, commodo ante ullamcorper, vestibulum ex. Fusce quis erat mauris. Praesent vel lorem eget justo mattis egestas eu eget tortor. Integer mattis, sapien quis efficitur viverra, neque est placerat orci, in sagittis nibh magna et risus. Nunc congue turpis eleifend justo suscipit, gravida finibus sapien lacinia. Suspendisse ultricies mi ornare enim imperdiet ullamcorper. Maecenas eu sem faucibus, vulputate eros eu, maximus magna. Mauris tempus non felis id mattis. Donec arcu neque, consequat sed ultrices eu, varius nec ante. Duis sodales odio non elit efficitur dapibus. Nunc eu sagittis libero, in eleifend velit. Curabitur ac tristique tellus. Phasellus in nisl porta, commodo ante ullamcorper, vestibulum ex. Fusce quis erat mauris. Praesent vel lorem eget justo mattis egestas eu eget tortor. Integer mattis, sapien quis efficitur viverra, neque est placerat orci, in sagittis nibh magna et risus. Nunc congue turpis eleifend justo suscipit, gravida finibus sapien lacinia. Suspendisse ultricies mi ornare enim imperdiet ullamcorper. Maecenas eu sem faucibus, vulputate eros eu, maximus magna. Mauris tempus non felis id mattis. Donec arcu neque, consequat sed ultrices eu, varius nec ante. Duis sodales odio non elit efficitur dapibus. Nunc eu sagittis libero, in eleifend velit. Curabitur ac tristique tellus. Phasellus in nisl porta, commodo ante ullamcorper, vestibulum ex. Fusce quis erat mauris. Praesent vel lorem eget justo mattis egestas eu eget tortor. Integer mattis, sapien quis efficitur viverra, neque est placerat orci, in sagittis nibh magna et risus. Nunc congue turpis eleifend justo suscipit, gravida finibus sapien lacinia. Suspendisse ultricies mi ornare enim imperdiet ullamcorper. Maecenas eu sem faucibus, vulputate eros eu, maximus magna. Mauris tempus non felis id mattis. Donec arcu neque, consequat sed ultrices eu, varius nec ante. Duis sodales odio non elit efficitur dapibus. Nunc eu sagittis libero, in eleifend velit. Curabitur ac tristique tellus. Phasellus in nisl porta, commodo ante ullamcorper, vestibulum ex. Fusce quis erat mauris. Praesent vel lorem eget justo mattis egestas eu eget tortor. Integer mattis, sapien quis efficitur viverra, neque est placerat orci, in sagittis nibh magna et risus. Nunc congue turpis eleifend justo suscipit, gravida finibus sapien lacinia. Suspendisse ultricies mi ornare enim imperdiet ullamcorper. Maecenas eu sem faucibus, vulputate eros eu, maximus magna. Mauris tempus non felis id mattis. Donec arcu neque, consequat sed ultrices eu, varius nec ante. Duis sodales odio non elit efficitur dapibus. Nunc eu sagittis libero, in eleifend velit. Curabitur ac tristique tellus. Phasellus in nisl porta, commodo ante ullamcorper, vestibulum ex. Fusce quis erat mauris. Praesent vel lorem eget justo mattis egestas eu eget tortor. Integer mattis, sapien quis efficitur viverra, neque est placerat orci, in sagittis nibh magna et risus. Nunc congue turpis eleifend justo suscipit, gravida finibus sapien lacinia. Suspendisse ultricies mi ornare enim imperdiet ullamcorper. Maecenas eu sem faucibus, vulputate eros eu, maximus magna. Mauris tempus non felis id mattis. Donec arcu neque, consequat sed ultrices eu, varius nec ante. Duis sodales odio non elit efficitur dapibus. Nunc eu sagittis libero, in eleifend velit. Curabitur ac tristique tellus. Phasellus in nisl porta, commodo ante ullamcorper, vestibulum ex. Fusce quis erat mauris. Praesent vel lorem eget justo mattis egestas eu eget tortor. Integer mattis, sapien quis efficitur viverra, neque est placerat orci, in sagittis nibh magna et risus. Nunc congue turpis eleifend justo suscipit, gravida finibus sapien lacinia. Suspendisse ultricies mi ornare enim imperdiet ullamcorper. Maecenas eu sem faucibus, vulputate eros eu, maximus magna. Mauris tempus non felis id mattis. Donec arcu neque, consequat sed ultrices eu, varius nec ante. Duis sodales odio non elit efficitur dapibus. Nunc eu sagittis libero, in eleifend velit. Curabitur ac tristique tellus. Phasellus in nisl porta, commodo ante ullamcorper, vestibulum ex. Fusce quis erat mauris. Praesent vel lorem eget justo mattis egestas eu eget tortor. Integer mattis, sapien quis efficitur viverra, neque est placerat orci, in sagittis nibh magna et risus.'),
                    ))),
            Row(
              children: [
                Checkbox(
                  value: _isAgreed,
                  onChanged: (bool newValue) {
                    setState(() {
                      _isAgreed = newValue;
                    });
                  },
                ),
                Expanded(child: Text("I agree with out Terms and Conditions"))
              ],
            ),
            OutlineButton(
              onPressed: () {
                if (_isAgreed) {
                  Navigator.push(context, TokenScreen.route());
                }
              },
              child: Text('Next'),
            )
          ],
        ),
      ),
    );
  }
}
